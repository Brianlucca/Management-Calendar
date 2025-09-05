import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Calendar, ListTodo, AlarmCheck, Tags, CheckCircle } from 'lucide-react';
import appLogo from '/logo.png';
import heroImage from '/calendar-events.svg';
import featureImage from '/calendar-online.svg';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={appLogo} alt="Logo" className="w-8 h-auto" />
          <span className="text-xl font-bold text-slate-800">Management Calendar</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Funcionalidades</a>
          <a href="#benefits" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Benefícios</a>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Link to="/signin" className="font-semibold text-slate-700 hover:text-indigo-600 transition-colors">Entrar</Link>
          <Link to="/signup" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm">Criar Conta</Link>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white px-6 pb-6 border-t border-slate-200">
          <nav className="flex flex-col gap-4 pt-4">
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-slate-600 hover:text-indigo-600 font-medium">Funcionalidades</a>
            <a href="#benefits" onClick={() => setIsMenuOpen(false)} className="text-slate-600 hover:text-indigo-600 font-medium">Benefícios</a>
            <Link to="/signin" className="font-semibold text-slate-700 hover:text-indigo-600 pt-4 border-t border-slate-200">Entrar</Link>
            <Link to="/signup" className="w-full text-center px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Criar Conta</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="bg-slate-50 border-t border-slate-200">
    <div className="container mx-auto px-6 py-8 text-center text-slate-500">
      <img src={appLogo} alt="Logo" className="w-12 h-auto mx-auto mb-4" />
      <p>&copy; {new Date().getFullYear()} Management Calendar. Todos os direitos reservados.</p>
      <p className="text-xs mt-1">
        Desenvolvido por <a href="https://github.com/Brianlucca" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline text-indigo-600">Brian Lucca</a>
      </p>
    </div>
  </footer>
);

const LandingPage = () => {
  const features = [
    { icon: <Calendar size={28} className="text-indigo-500"/>, title: "Calendário Inteligente", description: "Visualize todos os seus compromissos com uma interface limpa e interativa." },
    { icon: <ListTodo size={28} className="text-sky-500"/>, title: "Lembretes Simples", description: "Crie e gerencie lembretes rápidos para nunca mais esquecer de uma tarefa." },
    { icon: <AlarmCheck size={28} className="text-rose-500"/>, title: "Foco com Pomodoro", description: "Aumente sua produtividade com um timer Pomodoro personalizável e integrado." },
    { icon: <Tags size={28} className="text-emerald-500"/>, title: "Organização por Tags", description: "Categorize seus eventos e tarefas com tags coloridas para uma melhor organização." },
  ];

  return (
    <div className="bg-white text-slate-700">
      <Header />
      
      <main className="pt-20">
        <section className="container mx-auto px-6 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tighter">
            Organize sua rotina, conquiste seus objetivos.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600">
            Management Calendar é a ferramenta definitiva para centralizar seus eventos, lembretes e sessões de foco em um só lugar.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/signup" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg text-lg">
              Comece a usar gratuitamente
            </Link>
          </div>
          <img src={heroImage} alt="Ilustração do Calendário" className="w-full max-w-4xl mx-auto mt-16"/>
        </section>

        <section id="features" className="bg-slate-50 py-20 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Tudo que você precisa para ser mais produtivo</h2>
              <p className="mt-4 text-lg text-slate-600">Ferramentas poderosas com um design simples e intuitivo.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {features.map(feature => (
                <div key={feature.title} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/60">
                  <div className="w-14 h-14 flex items-center justify-center bg-indigo-100 rounded-xl mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
                  <p className="mt-2 text-slate-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="benefits" className="py-20 md:py-24">
          <div className="container mx-auto px-6">
             <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                <div className="md:w-1/2">
                    <img src={featureImage} alt="Benefícios da Organização" className="rounded-lg w-full"/>
                </div>
                <div className="md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Visualize seu dia com clareza. Planeje com confiança.</h2>
                    <p className="mt-4 text-lg text-slate-600">Com todos os seus compromissos em um único calendário, você toma decisões melhores e reduz o estresse de se lembrar de tudo.</p>
                    <ul className="mt-6 space-y-3">
                        <li className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-emerald-500"/><span>Visão unificada de tarefas e eventos.</span></li>
                        <li className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-emerald-500"/><span>Filtre e organize com tags personalizadas.</span></li>
                        <li className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-emerald-500"/><span>Acesse de qualquer lugar.</span></li>
                    </ul>
                </div>
             </div>
          </div>
        </section>

        <section className="bg-slate-900 text-white py-20 md:py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Pronto para transformar sua produtividade?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">Crie sua conta gratuita e comece a organizar sua vida em menos de um minuto.</p>
            <div className="mt-8">
              <Link to="/signup" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-all shadow-lg text-lg">
                Começar Agora
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;