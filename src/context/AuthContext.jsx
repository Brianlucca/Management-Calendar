import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { auth, firestore } from "../service/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { setupAuthStateListener } from "../service/AuthService/AuthService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuthListener = setupAuthStateListener();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setUserRole(null);
        setLoading(false);
        navigate("/signin");
        return;
      }

      try {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();

          if (user.emailVerified && !userData.isActive) {
            await updateDoc(doc(firestore, "users", user.uid), {
              isActive: true,
              emailVerified: true
            });
          }

          if (!userData.isActive) {
            await signOut(auth);
            navigate("/signin");
            return;
          }

          setUserRole(userData.role);
          setCurrentUser(user);

          if (userData.role === "administrador") {
            console.log("Usuário é administrador");
          } else if (userData.role === "coordenador") {
            console.log("Usuário é coordenador");
          } else {
            console.log("Usuário é usuário comum");
          }
        } else {
          await signOut(auth);
          navigate("/signin");
        }
      } catch (error) {
        console.error("Erro ao buscar role do usuário:", error);
        await signOut(auth);
        navigate("/signin");
      }

      setLoading(false);
    });

    return () => {
      unsubscribeAuthListener();
      unsubscribe();
    }
  }, [navigate]);

  const value = {
    currentUser,
    userRole,
    loading,
    signUp: async (email, password, name, role, color) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await sendEmailVerification(user);

        await setDoc(doc(firestore, "users", user.uid), {
          name,
          email,
          role,
          color,
          createdAt: new Date().toISOString(),
          isActive: false,
          emailVerified: false
        });

        return user;
      } catch (error) {
        console.error("Erro ao cadastrar:", error);
        throw error;
      }
    },
    signIn: async (email, password) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
          throw new Error("Conta não ativada. Verifique seu e-mail.");
        }

        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();

          return { user, role: userData.role };
        } else {
          throw new Error("Usuário não encontrado no Firestore.");
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
      }
    },
    logout: async () => {
      await signOut(auth);
      setCurrentUser(null);
      setUserRole(null);
      navigate("/signin");
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export { AuthContext };