import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import appLogo from "/logo.png";

const NotFoundPage = () => {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-block mb-8">
          <img src={appLogo} alt="Management Calendar Logo" className="w-20 h-auto" />
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/70 p-8 md:p-12">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 mb-6">
            <AlertTriangle className="w-8 h-8 text-indigo-600" />
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter">
            404
          </h1>
          <h2 className="mt-4 text-2xl md:text-3xl font-bold text-slate-800">
            Página Não Encontrada
          </h2>
          <p className="mt-2 text-slate-600">
            Desculpe, não conseguimos encontrar a página que você está procurando. Ela pode ter sido movida ou nunca existiu.
          </p>

          <Link
            to="/"
            className="mt-8 inline-block w-full max-w-xs px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md shadow-indigo-500/20"
          >
            Voltar para o Início
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;