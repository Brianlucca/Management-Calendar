import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  Tags,
  List,
  ListTodo,
} from "lucide-react";
import { logout } from "../../../service/AuthService/AuthService";
import { useNotification } from "../../../components/notification/Notification";
const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { showNotification } = useNotification();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      showNotification(`Logout failed`, "error");
    }
  };
  const getRouteName = (pathname) => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/admin":
        return "Administração";
      case "/profile":
        return "Perfil";
      case "/tags":
        return "Gerenciar Tags";
      case "/reminder":
        return "Lembretes";
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
            <span className="text-xl font-bold">
              {getRouteName(location.pathname)}
            </span>
          </div>
        </div>
        {isOpen && (
          <ul className="mt-4 space-y-4">
            <li>
              <Link
                to="/"
                className="text-white flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
              >
                <LayoutDashboard /> <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/reminder"
                className="text-white flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
              >
                <ListTodo /> <span>Lembretes</span>
              </Link>
            </li>
            <li>
              <Link
                to="/tags"
                className="text-white flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
              >
                <Tags /> <span>Gerenciar Tags</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="text-white flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
              >
                <User /> <span>Perfil</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-white flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
              >
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
