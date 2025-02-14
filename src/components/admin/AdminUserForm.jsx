import React, { useState } from "react";
import { signUp } from "../../service/AuthService/AuthService";
import { useAuth } from "../../context/AuthContext";

const COLORS = [
  "#FF5733", // Vermelho
  "#33FF57", // Verde
  "#3357FF", // Azul
  "#FF33A8", // Rosa
  "#A833FF", // Roxo
  "#33FFF3", // Ciano
  "#F3FF33", // Amarelo
  "#FF8C33", // Laranja
  "#8C33FF", // Violeta
  "#33FF8C", // Verde Claro
  "#33A8FF", // Azul Claro
  "#FFA833", // Laranja Claro
  "#A833A8", // Magenta
  "#33F3FF", // Azul Ciano
  "#FF33F3", // Rosa Choque
];

const AdminUserForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario comum");
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      await signUp(email, password, name, role, color);

      setEmail("");
      setPassword("");
      setRole("usuario comum");
      setName("");
      setColor(COLORS[0]);

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
    <div className="max-w-4xl mx-auto mt-10 p-6 dark:bg-gray-900 text-white rounded-lg shadow-md">
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
              className="dark:bg-slate-800 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-white text-sm rounded-lg w-full p-2.5"
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
              className="dark:bg-slate-800 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-white text-sm rounded-lg w-full p-2.5"
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
              className="dark:bg-slate-800 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-white text-sm rounded-lg w-full p-2.5"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Função</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="dark:bg-slate-800 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-white text-sm rounded-lg w-full p-2.5"
            >
              <option value="usuario comum">Usuário Comum</option>
              <option value="coordenador">Coordenador</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Cor do Usuário
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
              className="dark:bg-slate-800 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-white text-sm rounded-lg w-full p-2.5"
            >
              {COLORS.map((c, index) => (
                <option key={index} value={c} style={{ backgroundColor: c }}>
                  {c} {color === c && "(Selecionado)"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
};

export default AdminUserForm;
