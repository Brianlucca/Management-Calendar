import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, ShieldCheck, User, LogOut, Users, ChevronDown, Menu, Tags } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { logout } from "../../../service/AuthService/AuthService";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { userRole } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className={`z-50 flex fixed top-0 left-0 h-full ${isOpen ? "w-64" : "w-20"} bg-gray-900 text-white p-4 transition-all duration-300`}> 
      <nav className="w-full h-full flex flex-col">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-xl mb-4 self-start p-2 rounded hover:bg-gray-800"
        >
          <Menu />
        </button>
        <ul className="space-y-4 flex-1">
          <li>
            <Link to="/" className="text-white flex items-center space-x-2 p-2 hover:bg-gray-800 rounded">
              <LayoutDashboard /> <span className={isOpen ? "block" : "hidden"}>Dashboard</span>
            </Link>
          </li>
          {userRole === "administrador" && (
            <li>
              <button onClick={() => setAdminOpen(!adminOpen)} className="flex items-center justify-between w-full p-2 hover:bg-gray-800 rounded">
                <div className="flex items-center space-x-2">
                  <ShieldCheck /> <span className={isOpen ? "block" : "hidden"}>Administrador</span>
                </div>
                {isOpen && <ChevronDown className={`${adminOpen ? "rotate-180" : ""} transition-transform`} />}
              </button>
              {adminOpen && (
                <ul className={`ml-6 space-y-2 ${isOpen ? "block" : "hidden"}`}>
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
              <User /> <span className={isOpen ? "block" : "hidden"}>Perfil</span>
            </Link>
          </li>
          <li>
            <Link to="/tags" className="text-white flex items-center space-x-2 p-2 hover:bg-gray-800 rounded">
              <Tags /> <span className={isOpen ? "block" : "hidden"}>Gerenciar Tags</span>
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="text-white flex items-center space-x-2 p-2 hover:bg-gray-800 rounded">
              <LogOut /> <span className={isOpen ? "block" : "hidden"}>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;