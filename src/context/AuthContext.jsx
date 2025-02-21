import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from "../service/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import Loading from "../components/loading/Loading";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (!user) {
        setCurrentUser(null);
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const providerData = user.providerData[0]?.providerId;
        if (providerData !== 'google.com' && !user.emailVerified) {
          navigate("/verify-email", { replace: true });
          setLoading(false);
          return;
        }

        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await signOut(auth);
          setLoading(false);
          return;
        }

        setCurrentUser(user);
        setUserData(userDoc.data());
      } catch (error) {
        await signOut(auth);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserData(null);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, logout }}>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}export { AuthContext };
