import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <>
    <footer className="bg-gray-750 text-black p-8 w-full md:ml-20 md:w-[calc(100%-5rem)]">
      <div className="container mx-auto text-center md:text-left grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
        
        <div className="flex flex-col items-center sm:items-start">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-20 h-auto mb-4"
          />
          <p className="text-sm mb-2">&copy; {new Date().getFullYear()} Management Calendar</p>
          <p className="text-sm">Site desenvolvido por <a href="https://github.com/Brianlucca" target="_blank" rel="noopener noreferrer" className="underline">Brian Lucca</a></p>
        </div>

        <div className="flex flex-col items-center sm:items-start">
          <h3 className="font-semibold text-lg mb-3">Links Rápidos</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:underline">Dashboard</a></li>
            <li><a href="/reminder" className="hover:underline">Lembretes</a></li>
            <li><a href="/profile" className="hover:underline">Perfil</a></li>
            <li><a href="/tags" className="hover:underline">Gerenciar Tags</a></li>
          </ul>
        </div>

        <div className="flex flex-col items-center sm:items-start">
          <h3 className="font-semibold text-lg mb-3">Contato</h3>
          <a className="text-sm mb-2 hover:underline" href="mailto:suportemanagementcalendar@gmail.com">E-mail</a>
        </div>

        <div className="flex flex-col items-center sm:items-start">
          <h3 className="font-semibold text-lg mb-3">Redes Sociais</h3>
          <div className="flex space-x-6">
            <a href="https://www.linkedin.com/in/brian-lucca-cardozo" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-blue-700">
              <Linkedin size={24} />
            </a>
            <a href="https://github.com/Brianlucca" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-indigo-800">
              <Github size={24} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-5 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Management Calendar. Todos os direitos reservados.</p>
        <p>Versão 1.1.0</p>
      </div>
    </footer>
    </>
  );
};

export default Footer;
