import React, { useState, useEffect } from "react";
import { firestore } from "../../../service/FirebaseConfig";
import { collection, doc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { Trash2, UserX, UserCheck } from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersCollection = collection(firestore, "users");

    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const userDoc = doc(firestore, "users", userId);
      await deleteDoc(userDoc);
    } catch (err) {
      console.error("Erro ao excluir o usuário:", err);
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, { isActive: false });
    } catch (err) {
      console.error("Erro ao desativar o usuário:", err);
    }
  };

  const handleActivate = async (userId) => {
    try {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, { isActive: true });
    } catch (err) {
      console.error("Erro ao ativar o usuário:", err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, { role: newRole });
    } catch (err) {
      console.error("Erro ao alterar o papel do usuário:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Painel de Administração</h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                E-mail
              </th>
              <th scope="col" className="px-6 py-3">
                Papel
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-gray-600">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1"
                  >
                    <option value="administrador">Administrador</option>
                    <option value="coordenador">Coordenador</option>
                    <option value="usuario comum">Usuário Comum</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {user.isActive ? (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                      Ativo
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
                      Inativo
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  {user.isActive ? (
                    <button
                      onClick={() => handleDeactivate(user.id)}
                      className="text-yellow-600 hover:text-yellow-900 flex items-center"
                    >
                      <UserX className="h-5 w-5 mr-1" />
                      Desativar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(user.id)}
                      className="text-green-600 hover:text-green-900 flex items-center"
                    >
                      <UserCheck className="h-5 w-5 mr-1" />
                      Ativar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;