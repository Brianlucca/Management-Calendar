import React, { useState } from "react";
import { signUp } from "../../service/AuthService/AuthService";
import { ref, update } from "firebase/database";
import { db } from "../../service/FirebaseConfig";

const AdminUserForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario comum");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const userCredential = await signUp(email, password, name, role);

      await update(ref(db, `users/${userCredential.user.uid}`), {
        email,
        name,
        role,
        uid: userCredential.user.uid,
      });

      setEmail("");
      setPassword("");
      setRole("usuario comum");
      setName("");

      alert(
        "Usuário cadastrado com sucesso! O e-mail de verificação foi enviado."
      );
    } catch (err) {
      setError("Erro ao cadastrar o usuário: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6 text-black rounded-lg md:shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Cadastrar Novo Usuário
        </h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome Usuario"
                required
                className="dark:bg-slate-200 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 text-black text-sm rounded-lg w-full p-2.5"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="E-mail"
                className="dark:bg-slate-200 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 text-black text-sm rounded-lg w-full p-2.5"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Senha"
                className="dark:bg-slate-200 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 text-black text-sm rounded-lg w-full p-2.5"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Função</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="dark:bg-slate-200 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 text-black text-sm rounded-lg w-full p-2.5"
              >
                <option value="usuario comum">Usuário Comum</option>
                <option value="coordenador">Coordenador</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="text-white bg-slate-800 hover:bg-slate-700 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminUserForm;
