import React, { useState } from "react";
import { signUp, signInWithGoogle } from "../../service/AuthService/AuthService.js";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../components/notification/Notification.jsx";
import { User, Mail, Lock, AlertCircle } from "lucide-react";
import googleLogo from "/logo-google.png";
import appLogo from "/logo.png";
import background from "/calendar-online.svg";
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "../../utils/validation/Validation.js";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {
            name: validateName(name),
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: validateConfirmPassword(password, confirmPassword),
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== "")) return;

        try {
            await signUp(name, email, password);
            showNotification("Conta criada! Verifique seu e-mail para confirmar.", "success");
            navigate("/verify-email");
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                showNotification("Este e-mail já está em uso.", "error");
            } else {
                showNotification(`Erro ao criar conta. Tente novamente!`, "error");
            }
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            await signInWithGoogle();
            showNotification("Conta criada com Google!", "success");
            navigate("/");
        } catch (error) {
            showNotification(`Erro, tente novamente!`, "error");
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="hidden md:flex w-1/2 bg-slate-50 flex-col items-center justify-center p-12 text-center">
                <img src={appLogo} alt="Management Calendar Logo" className="w-24 h-auto mb-6" />
                <h1 className="text-3xl font-bold text-slate-800">Comece a organizar sua vida hoje mesmo</h1>
                <p className="text-slate-600 mt-2">Crie sua conta e ganhe clareza e controle sobre seu tempo.</p>
                <img src={background} alt="Ilustração de um calendário online" className="w-full max-w-lg mt-8" />
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6">
                <div className="w-full max-w-sm mx-auto">
                    <div className="text-center md:text-left mb-10">
                        <h2 className="text-3xl font-bold text-slate-900">
                            Crie sua Conta
                        </h2>
                        <p className="text-slate-500 mt-1">É rápido e fácil. Vamos começar!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Nome completo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-slate-400" />
                                </div>
                                <input id="name" type="text" placeholder="Seu nome"
                                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-100 border rounded-lg transition ${errors.name ? 'border-red-300' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                    value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            {errors.name && <p className="flex items-center gap-1 text-red-600 text-sm mt-1"><AlertCircle size={14}/>{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-slate-400" />
                                </div>
                                <input id="email" type="email" placeholder="voce@exemplo.com"
                                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-100 border rounded-lg transition ${errors.email ? 'border-red-300' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                    value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            {errors.email && <p className="flex items-center gap-1 text-red-600 text-sm mt-1"><AlertCircle size={14}/>{errors.email}</p>}
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-slate-400" />
                                </div>
                                <input id="password" type="password" placeholder="Mínimo 6 caracteres"
                                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-100 border rounded-lg transition ${errors.password ? 'border-red-300' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                    value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            {errors.password && <p className="flex items-center gap-1 text-red-600 text-sm mt-1"><AlertCircle size={14}/>{errors.password}</p>}
                        </div>

                        <div>
                             <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-1">Confirme a senha</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-slate-400" />
                                </div>
                                <input id="confirmPassword" type="password" placeholder="Repita a senha"
                                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-100 border rounded-lg transition ${errors.confirmPassword ? 'border-red-300' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                            {errors.confirmPassword && <p className="flex items-center gap-1 text-red-600 text-sm mt-1"><AlertCircle size={14}/>{errors.confirmPassword}</p>}
                        </div>

                        <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md shadow-indigo-500/20">
                            Criar Conta
                        </button>
                    </form>

                    <div className="my-6 flex items-center">
                        <hr className="flex-grow border-slate-200" />
                        <span className="mx-4 text-xs font-medium text-slate-400">OU</span>
                        <hr className="flex-grow border-slate-200" />
                    </div>

                    <button onClick={handleGoogleSignUp} className="w-full py-3 flex items-center justify-center bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all">
                        <img src={googleLogo} alt="Google Logo" className="w-5 h-5 mr-3" />
                        Continuar com Google
                    </button>
                    
                    <p className="text-center text-sm text-slate-600 mt-8">
                        Já tem uma conta?{" "}
                        <span className="font-semibold text-indigo-600 cursor-pointer hover:underline" onClick={() => navigate("/signin")}>
                            Faça login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;