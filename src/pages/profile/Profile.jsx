import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { auth, firestore, db as realtimeDB } from "../../service/FirebaseConfig";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { ref, remove } from "firebase/database";
import { useNotification } from "../../components/notification/Notification";
import { User, KeyRound, AlertTriangle } from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";

moment.locale('pt-br');

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userRef = doc(firestore, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }
        } catch (error) {
          showNotification("Erro ao buscar dados do usuário.", "error");
        }
      }
    };
    fetchUserData();
  }, [currentUser, showNotification]);

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      showNotification("E-mail de redefinição de senha enviado!", "success");
      setIsResetModalOpen(false);
    } catch (error) {
      showNotification("Erro ao enviar e-mail de redefinição.", "error");
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    try {
      const firestoreDocRef = doc(firestore, "users", uid);
      const realtimeDbRef = ref(realtimeDB, `users/${uid}`);
      await Promise.all([
        deleteDoc(firestoreDocRef),
        remove(realtimeDbRef)
      ]);
      await deleteUser(currentUser);
      showNotification("Sua conta e todos os seus dados foram excluídos com sucesso.", "success");
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        showNotification("Por segurança, faça login novamente antes de excluir sua conta.", "error");
      } else {
        console.error("Erro detalhado ao excluir conta:", error);
        showNotification("Ocorreu um erro ao excluir a conta. Tente novamente.", "error");
      }
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Meu Perfil
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Gerencie suas informações e configurações de conta.
        </p>
      </header>
      
      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/70 p-6 lg:p-8">
          <div className="flex items-center gap-5 mb-8">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Foto do perfil"
                className="w-20 h-20 rounded-full object-cover border-4 border-slate-100"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-indigo-500 text-white text-3xl font-bold border-4 border-slate-100">
                {userData ? getInitials(userData.name) : <User />}
              </div>
            )}
            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                {userData ? userData.name : "Carregando..."}
              </h2>
              <p className="text-slate-500">{currentUser?.email}</p>
            </div>
          </div>

          <dl className="space-y-4">
            <div className="flex justify-between items-center">
              <dt className="text-sm font-medium text-slate-500">Membro desde</dt>
              <dd className="text-sm text-slate-700 font-semibold">
                {currentUser ? moment(currentUser.metadata.creationTime).format("D [de] MMMM [de] YYYY") : "..."}
              </dd>
            </div>
          </dl>
          
          <hr className="my-8 border-slate-200" />
          
          <div>
            <h3 className="text-lg font-bold text-slate-800">Segurança</h3>
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 mb-2 sm:mb-0">Deseja alterar sua senha?</p>
              <button
                onClick={() => setIsResetModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <KeyRound className="w-4 h-4" />
                Redefinir Senha
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
           <h3 className="text-lg font-bold text-red-700">Zona de Perigo</h3>
           <div className="mt-4 p-4 bg-white rounded-2xl shadow-lg border border-red-200 flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0">
                <h4 className="font-semibold text-slate-800">Excluir sua conta</h4>
                <p className="text-sm text-slate-600 max-w-md">Esta ação é permanente e todos os seus dados serão removidos. Não será possível reverter.</p>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 hover:text-red-700 transition-colors"
              >
                Excluir Conta
              </button>
           </div>
        </div>
      </div>
      
      {isResetModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-slate-800">Redefinir Senha</h3>
            <p className="text-slate-500 mt-2">
              Enviaremos um link de redefinição para o seu e-mail: <strong>{currentUser?.email}</strong>
            </p>
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setIsResetModalOpen(false)} className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all">Cancelar</button>
              <button onClick={handlePasswordReset} className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all">Enviar Link</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Excluir Conta Permanentemente</h3>
            <p className="text-slate-500 mt-2">
              Tem certeza absoluta? Todos os seus dados, incluindo tarefas e tags, serão perdidos para sempre.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all">Cancelar</button>
              <button onClick={handleDeleteAccount} className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all">Sim, Excluir Minha Conta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;