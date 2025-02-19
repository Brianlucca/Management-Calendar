import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updatePassword } from "firebase/auth";

const Profile = () => {
  const { currentUser } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      await updatePassword(currentUser, newPassword);
      setSuccess("Senha alterada com sucesso!");
    } catch (error) {
      setError("Erro ao alterar a senha: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Perfil do Usuário</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <p className="mt-1 text-gray-900">{currentUser.displayName || "Nome não disponível"}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <p className="mt-1 text-gray-900">{currentUser.email}</p>
      </div>
      <form onSubmit={handlePasswordChange}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Alterar Senha
        </button>
      </form>
    </div>
  );
};

export default Profile;