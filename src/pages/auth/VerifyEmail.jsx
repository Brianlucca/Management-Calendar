import { useEffect, useState } from "react";
import { auth } from "../../service/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../components/notification/Notification";
import { sendEmailVerification } from "firebase/auth";
import { MailCheck, CheckCircle2 } from "lucide-react";
import appLogo from "/logo.png";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    if (currentUser.providerData[0]?.providerId === "google.com" || currentUser.emailVerified) {
      navigate("/");
      return;
    }

    const interval = setInterval(async () => {
      await currentUser.reload();
      if (currentUser.emailVerified) {
        setIsVerified(true);
        clearInterval(interval);
        showNotification("E-mail verificado com sucesso!", "success");
        setTimeout(() => navigate("/"), 2000);
      }
    }, 3000);

    setLoading(false);
    return () => clearInterval(interval);
  }, [currentUser, navigate, showNotification]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || !currentUser) return;
    try {
      await sendEmailVerification(currentUser);
      showNotification("Novo e-mail de verificação enviado!", "success");
      setResendCooldown(60);
    } catch (error) {
      showNotification("Erro ao reenviar e-mail. Tente novamente mais tarde.", "error");
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
          <p className="text-slate-600 mt-4">Carregando...</p>
        </>
      );
    }

    if (isVerified) {
      return (
        <>
          <CheckCircle2 className="w-20 h-20 text-emerald-500" />
          <h2 className="text-3xl font-bold text-slate-800 mt-6">E-mail Verificado!</h2>
          <p className="text-slate-600 mt-2 text-center">
            Sua conta foi confirmada com sucesso. Redirecionando...
          </p>
        </>
      );
    }

    return (
      <>
        <MailCheck className="w-20 h-20 text-indigo-500" />
        <h2 className="text-3xl font-bold text-slate-800 mt-6">Verifique seu E-mail</h2>
        <p className="text-slate-600 mt-2 text-center max-w-sm">
          Enviamos um link de confirmação para <strong>{currentUser?.email}</strong>. Por favor, clique no link para ativar sua conta.
        </p>
        <div className="mt-8">
          <button
            onClick={handleResendEmail}
            disabled={resendCooldown > 0}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : "Reenviar E-mail"}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-4 text-center">
          Não se esqueça de checar sua caixa de spam.
        </p>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <img src={appLogo} alt="Logo" className="w-24 h-auto mb-8" />
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/70 w-full max-w-lg p-8 md:p-12 flex flex-col items-center">
            {renderContent()}
        </div>
    </div>
  );
};

export default VerifyEmail;