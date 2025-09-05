import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  Tags,
  ListTodo,
  AlarmCheck,
  X,
  Calendar,
} from "lucide-react";
import { logout } from "../../service/AuthService/AuthService";
import { useNotification } from "../notification/Notification";
import { TagContext } from "../../context/TagContext";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { showNotification } = useNotification();
  const { tags } = useContext(TagContext);

  const accentColor = tags.length > 0 ? tags[0].color : '#4f46e5'; 

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      showNotification(`Logout failed`, "error");
    }
  };

  const closeMenu = () => setIsOpen(false);

  const getRouteName = (pathname) => {
    switch (pathname) {
      case "/": return "Dashboard";
      case "/calendar": return "Calendário";
      case "/reminder": return "Lembretes";
      case "/pomodoro": return "Pomodoro";
      case "/tags": return "Gerenciar Tags";
      case "/profile": return "Perfil";
      default: return "Menu";
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
    <>
      <header className="z-40 fixed top-0 left-0 w-full bg-slate-900 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(true)}
            className="text-xl p-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <Menu />
          </button>
          <span className="text-xl font-bold">
            {getRouteName(location.pathname)}
          </span>
          <div className="w-9 h-9"></div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60"
          onClick={closeMenu}
        ></div>

        <nav
          className={`relative flex flex-col w-4/5 max-w-sm h-full bg-slate-900 text-white p-6 transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-2xl font-bold">Menu</span>
            <button
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-slate-800"
            >
              <X />
            </button>
          </div>

          <ul className="flex-1 space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={closeMenu}
                  className={`flex items-center gap-4 p-3 rounded-lg text-lg font-medium transition-colors ${
                    location.pathname === link.to
                      ? "text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                  style={{
                    backgroundColor: location.pathname === link.to ? accentColor : 'transparent'
                  }}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <hr className="my-4 border-slate-700" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-3 rounded-lg text-lg font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogOut />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;