import { useEffect, useState } from "react";
import { auth } from "../../../service/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { checkEmailVerification } from "../../../service/AuthService/AuthService"

const VerifyEmail = () => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;

    const checkVerification = async () => {
      try {
        if (!auth.currentUser) {
          navigate("/");
          return;
        }

        await auth.currentUser.reload();

        if (!auth.currentUser) {
          navigate("/");
          return;
        }

        const provider = auth.currentUser.providerData[0]?.providerId;
        if (provider === "google.com") {
          navigate("/");
          return;
        }

        const isVerified = await checkEmailVerification(auth.currentUser);
        
        if (isVerified) {
          setEmailVerified(true);
          clearInterval(interval);
          setTimeout(() => navigate("/"), 2000);
        }
      } catch (error) {
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
    interval = setInterval(checkVerification, 3000);  // Verifica a cada 3 segundos

    return () => clearInterval(interval);
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <p className="text-gray-600 mt-4">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold text-gray-700">Verifique seu e-mail</h2>
      {!emailVerified ? (
        <p className="text-gray-600 mt-4 text-center">
          Clique no link enviado para seu e-mail e aguarde alguns segundos...
        </p>
      ) : (
        <p className="text-green-600 mt-4 text-center">✅ Seu e-mail foi verificado! Redirecionando...</p>
      )}
    </div>
  );
};

export default VerifyEmail;
