import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShieldCheck, User, LogOut, Users, ChevronDown, Menu, Tags } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { logout } from "../../../service/AuthService/AuthService";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { userRole } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const getRouteName = (pathname) => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/admin":
        return "Administração";
      case "/perfil":
        return "Perfil";
      case "/tags":
        return "Gerenciar Tags";
      default:
        return "Menu";
    }
  };

  return (
    <main className="z-50 flex fixed top-0 left-0 w-full bg-gray-900 text-white p-4">
      <nav className="w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-xl p-2 rounded hover:bg-gray-800"
            >
              <Menu />
            </button>
            <span className="text-xl font-bold">{getRouteName(location.pathname)}</span>
          </div>
        </div>
        {isOpen && (
          <ul className="mt-4 space-y-4">
            <li>
              <Link to="/" className="text-white flex items-center space-x-2 p-2 hover:bg-gray-800 rounded">
                <LayoutDashboard /> <span>Dashboard</span>
              </Link>
            </li>
            {userRole === "administrador" && (
              <li>
                <button onClick={() => setAdminOpen(!adminOpen)} className="flex items-center justify-between w-full p-2 hover:bg-gray-800 rounded">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck /> <span>Administrador</span>
                  </div>
                  <ChevronDown className={`${adminOpen ? "rotate-180" : ""} transition-transform`} />
                </button>
                {adminOpen && (
                  <ul className="ml-6 space-y-2">
                    <li>
                      <Link to="/admin" className="text-white flex items-center space-x-2 p-2 hover:bg-gray-800 rounded">
                        <Users /> <span>Gerenciador de Usuários</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )}
            <li>
              <Link to="/perfil" className="text-white flex items-center space-x-2 p-2 hover:bg-gray-800 rounded">
                <User /> <span>Perfil</span>
              </Link>
            </li>
            <li>
              <Link to="/tags" className="text-white flex items-center space-x-2 p-2 hover:bg-gray-800 rounded">
                <Tags /> <span>Gerenciar Tags</span>
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-white flex items-center space-x-2 p-2 hover:bg-gray-800 rounded">
                <LogOut /> <span>Logout</span>
              </button>
            </li>
          </ul>
        )}
      </nav>
    </main>
  );
};

export default MobileMenu;