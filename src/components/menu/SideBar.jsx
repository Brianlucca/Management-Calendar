import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  Tags,
  ListTodo,
  AlarmCheck,
  Calendar,
} from "lucide-react";
import { logout } from "../../service/AuthService/AuthService";
import { useNotification } from "../notification/Notification";
import { TagContext } from "../../context/TagContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { showNotification } = useNotification();
  const location = useLocation();
  const { tags } = useContext(TagContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      showNotification(`Logout failed`, "error");
    }
  };

  const navLinks = [
    { to: "/", icon: <LayoutDashboard />, label: "Dashboard" },
    { to: "/calendar", icon: <Calendar />, label: "Calendário" },
    { to: "/reminder", icon: <ListTodo />, label: "Lembretes" },
    { to: "/pomodoro", icon: <AlarmCheck />, label: "Pomodoro" },
    { to: "/tags", icon: <Tags />, label: "Gerenciar Tags" },
    { to: "/profile", icon: <User />, label: "Perfil" },
  ];

  return (
    <aside
      className={`z-50 flex fixed top-0 left-0 h-full ${
        isOpen ? "w-64" : "w-20"
      } bg-slate-900 text-white p-4 transition-all duration-300 flex-col`}
    >
      <nav className="w-full h-full flex flex-col">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xl mb-4 self-start p-3 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Menu />
        </button>
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? "bg-slate-700/80 text-white font-semibold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {link.icon}
                <span className={isOpen ? "block" : "hidden"}>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <hr className="my-4 border-slate-700/60" />

        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <h3
            className={`px-3 text-sm font-semibold text-slate-500 mb-2 ${
              isOpen ? "block" : "hidden"
            }`}
          >
            Tags
          </h3>
          <ul className="space-y-1">
            {tags.map((tag) => (
              <li key={tag.id}>
                <a href="#" className={`flex items-center transition-colors hover:bg-slate-800 group ${isOpen ? "space-x-4 p-3 rounded-lg" : "w-11 h-11 justify-center rounded-full"}`}>
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  ></span>
                  <span className={`text-slate-300 group-hover:text-white ${isOpen ? "block" : "hidden"}`}>
                    {tag.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="text-slate-400 w-full flex items-center space-x-4 p-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
          >
            <LogOut />
            <span className={isOpen ? "block" : "hidden"}>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;