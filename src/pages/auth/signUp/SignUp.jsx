import React, { useState } from "react";
import { signUp, signInWithGoogle } from "../../../service/AuthService/AuthService";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../components/notification/Notification";
import googleLogo from "/logo-google.png";
import background from "/calendar-online.svg";
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "../../../utils/validation/Validation.js"

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

        // Validar os campos
        const newErrors = {
            name: validateName(name),
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: validateConfirmPassword(password, confirmPassword),
        };

        setErrors(newErrors);

        // Verifica se há algum erro
        if (Object.values(newErrors).some((error) => error !== "")) return;

        try {
            await signUp(name, email, password);
            showNotification("Conta criada! Verifique seu e-mail 📩", "success");
            navigate("/verify-email");
        } catch (error) {
            showNotification(`Erro, tente novamente!`, "error");
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
        <div className="h-screen flex flex-col md:flex-row">
            {/* Imagem de fundo */}
            <div className="w-full md:w-1/2 h-64 md:h-full flex items-center justify-center bg-white">
                <img src={background} alt="Background" className="w-3/4 max-h-3/4 object-cover" />
            </div>

            {/* Formulário */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
                <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-slate-700 text-center mb-6">
                        Criar Conta
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Nome"
                                className={`w-full px-4 py-2 border ${errors.name ? "border-red-500" : "border-slate-300"} rounded-lg focus:ring-2 focus:border-slate-900 focus:outline-none text-black placeholder-gray-500`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="E-mail"
                                className={`w-full px-4 py-2 border ${errors.email ? "border-red-500" : "border-slate-300"} rounded-lg focus:ring-2 focus:border-slate-900 focus:outline-none text-black placeholder-gray-500`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Senha"
                                className={`w-full px-4 py-2 border ${errors.password ? "border-red-500" : "border-slate-300"} rounded-lg focus:ring-2 focus:border-slate-900 focus:outline-none text-black placeholder-gray-500`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Confirme a senha"
                                className={`w-full px-4 py-2 border ${errors.confirmPassword ? "border-red-500" : "border-slate-300"} rounded-lg focus:ring-2 focus:border-slate-900 focus:outline-none text-black placeholder-gray-500`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition duration-300"
                        >
                            Criar Conta
                        </button>
                    </form>

                    <div className="text-center my-4 text-gray-600">OU</div>

                    <button
                        onClick={handleGoogleSignUp}
                        className="w-full py-2 flex items-center justify-center border border-gray-300 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-300"
                    >
                        <img src={googleLogo} alt="Google" className="w-6 h-6 mr-3" />
                        Criar conta com Google
                    </button>

                    <p className="text-center text-gray-700 mt-4">
                        Já tem uma conta?{" "}
                        <span
                            className="text-blue-600 cursor-pointer hover:underline"
                            onClick={() => navigate("/signin")}
                        >
                            Entrar
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
