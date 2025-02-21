import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <AlertTriangle className="w-16 h-16 text-yellow-400 mb-4" />
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg text-gray-400 mt-2">Oops! Página não encontrada.</p>
      <p className="text-gray-500 mb-6">A página que você está procurando pode ter sido removida ou não existe.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Voltar para a Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
