import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  Tags,
  ListTodo,
} from "lucide-react";
import { logout } from "../../../service/AuthService/AuthService";
import { useNotification } from "../../notification/Notification";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { showNotification } = useNotification();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      showNotification(`Logout failed`, "error");
    }
  };
  return (
    <main
      className={`z-50 flex fixed top-0 left-0 h-full ${
        isOpen ? "w-64" : "w-20"
      } bg-gray-900 text-white p-4 transition-all duration-300`}
    >
      <nav className="w-full h-full flex flex-col">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xl mb-4 self-start p-3 rounded hover:bg-gray-800"
        >
          <Menu />
        </button>
        <ul className="space-y-4 flex-1">
          <li>
            <Link
              to="/"
              className="text-white flex items-center space-x-2 p-3 hover:bg-gray-800 rounded"
            >
              <LayoutDashboard />
              <span className={isOpen ? "block" : "hidden"}>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/reminder"
              className="text-white flex items-center space-x-2 p-3 hover:bg-gray-800 rounded"
            >
              <ListTodo />
              <span className={isOpen ? "block" : "hidden"}>Lembretes</span>
            </Link>
          </li>
          <li>
            <Link
              to="/tags"
              className="text-white flex items-center space-x-2 p-3 hover:bg-gray-800 rounded"
            >
              <Tags />
              <span className={isOpen ? "block" : "hidden"}>
                Gerenciar Tags
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="text-white flex items-center space-x-2 p-3 hover:bg-gray-800 rounded"
            >
              <User />
              <span className={isOpen ? "block" : "hidden"}>Perfil</span>
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-white flex items-center space-x-2 p-3 hover:bg-gray-800 rounded"
            >
              <LogOut />
              <span className={isOpen ? "block" : "hidden"}>Logout</span>
            </button>
          </li>
        </ul>
        <hr className="my-4 border-gray-700" />
        <div
          className={`text-center text-gray-500 text-sm ${
            isOpen ? "" : "whitespace-normal break-words"
          }`}
        >
          <p className={isOpen ? "" : "text-xs"}>@ 2025 Management Calendar</p>
          <p className={isOpen ? "" : "text-xs"}>Versão 1.1.0</p>
        </div>
      </nav>
    </main>
  );
};
export default Sidebar;
