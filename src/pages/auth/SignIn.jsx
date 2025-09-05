import React, { useState } from "react";
import { signIn, signInWithGoogle } from "../../service/AuthService/AuthService";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../components/notification/Notification";
import { Mail, Lock } from "lucide-react";
import googleLogo from "/logo-google.png";
import appLogo from "/logo.png";
import background from "/calendar-events.svg";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      showNotification(`Bem-vindo de volta!`, "success");
      navigate("/");
    } catch (error) {
      showNotification(`Email ou senha inválidos. Tente novamente!`, "error");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      showNotification("Login com Google realizado com sucesso!", "success");
      navigate("/");
    } catch (error) {
      showNotification(`Erro ao fazer login com Google.`, "error");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-slate-50 flex-col items-center justify-center p-12 text-center">
        <img src={appLogo} alt="Management Calendar Logo" className="w-24 h-auto mb-6" />
        <h1 className="text-3xl font-bold text-slate-800">Organize seu dia, conquiste seus objetivos</h1>
        <p className="text-slate-600 mt-2">Sua agenda inteligente para uma vida mais produtiva.</p>
        <img
          src={background}
          alt="Ilustração de um calendário"
          className="w-full max-w-lg mt-8"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-sm mx-auto">
          <div className="text-center md:text-left mb-10">
            <h2 className="text-3xl font-bold text-slate-900">
              Acesse sua Conta
            </h2>
            <p className="text-slate-500 mt-1">Que bom te ver de volta!</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md shadow-indigo-500/20"
            >
              Entrar
            </button>
          </form>

          <div className="my-6 flex items-center">
            <hr className="flex-grow border-slate-200" />
            <span className="mx-4 text-xs font-medium text-slate-400">OU</span>
            <hr className="flex-grow border-slate-200" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 flex items-center justify-center bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all"
          >
            <img src={googleLogo} alt="Google Logo" className="w-5 h-5 mr-3" />
            Entrar com Google
          </button>
          
          <p className="text-center text-sm text-slate-600 mt-8">
            Não tem uma conta?{" "}
            <span
              className="font-semibold text-indigo-600 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Crie uma agora
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;