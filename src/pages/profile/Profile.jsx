import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, firestore } from "../../service/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNotification } from "../../components/notification/Notification";

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userRef = doc(firestore, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          } else {
            showNotification(`Informação não encontrada, fale com o suporte.`, "error");
          }
        } catch (error) {
          showNotification("Erro ao buscar dados do usuário, fale com o suporte", "error");
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      showNotification("E-mail de redefinição de senha enviado com sucesso!", "success");
      setIsModalOpen(false);
    } catch (error) {
      showNotification("Erro ao enviar e-mail", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto md:mt-10 mt-20 p-6 m-56 rounded-xl shadow-lg border">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Perfil do Usuário</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <p className="mt-1 text-gray-900">{userData ? userData.name : "Carregando..."}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <p className="mt-1 text-gray-900">{currentUser.email}</p>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Redefinir Senha
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Redefinir Senha</h3>
            <form onSubmit={handlePasswordReset}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                className="w-full p-2 border rounded-md mb-4"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
