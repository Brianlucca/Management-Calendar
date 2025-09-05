import { Github, Linkedin } from "lucide-react";
import { useContext } from "react";
import { PageThemeContext } from "../../context/PageThemeContext";

const Footer = () => {
  const { theme } = useContext(PageThemeContext);

  return (
    <footer className={`p-8 w-full transition-colors duration-500 ${theme.footerClass}`}>
      <div className="container mx-auto text-center md:text-left grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="flex flex-col items-center md:items-start">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-16 h-auto mb-4"
          />
          <p className="text-sm font-semibold">Management Calendar</p>
          <p className="text-xs mt-1">
            Desenvolvido por <a href="https://github.com/Brianlucca" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">Brian Lucca</a>
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-semibold text-base mb-3">Navegação</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:underline">Dashboard</a></li>
            <li><a href="/reminder" className="hover:underline">Lembretes</a></li>
            <li><a href="/pomodoro" className="hover:underline">Pomodoro</a></li>
            <li><a href="/tags" className="hover:underline">Tags</a></li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-semibold text-base mb-3">Recursos</h3>
          <ul className="space-y-2 text-sm">
             <li><a href="/profile" className="hover:underline">Meu Perfil</a></li>
             <li><a className="hover:underline" href="mailto:suportemanagementcalendar@gmail.com">Suporte</a></li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-semibold text-base mb-3">Conecte-se</h3>
          <div className="flex space-x-4">
            <a href="https://www.linkedin.com/in/brian-lucca-cardozo" target="_blank" rel="noopener noreferrer" className=" hover:opacity-80 transition-opacity">
              <Linkedin size={22} />
            </a>
            <a href="https://github.com/Brianlucca" target="_blank" rel="noopener noreferrer" className=" hover:opacity-80 transition-opacity">
              <Github size={22} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-[inherit] text-center text-xs">
        <p>&copy; {new Date().getFullYear()} Management Calendar. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;