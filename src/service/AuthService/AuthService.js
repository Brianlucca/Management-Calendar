import { auth, firestore } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export const signUp = async (email, password, name, role, color) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await sendEmailVerification(user);

    await setDoc(doc(firestore, "users", user.uid), {
      name,
      email,
      role,
      color,
      createdAt: new Date().toISOString(),
      isActive: false,
      emailVerified: user.emailVerified,
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.uid === user.uid) {
        if (currentUser.emailVerified) {
          await updateDoc(doc(firestore, "users", currentUser.uid), {
            isActive: true,
            emailVerified: true,
          });
          unsubscribe();
        }
      }
    });

    return user;
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userDoc = await getDoc(doc(firestore, "users", user.uid));

    if (!userDoc.exists()) {
      throw new Error("Usuário não encontrado");
    }

    const userData = userDoc.data();

    if (user.emailVerified && !userData.isActive) {
      await updateDoc(doc(firestore, "users", user.uid), {
        isActive: true,
        emailVerified: true,
      });
    }

    if (!userData.isActive) {
      throw new Error("Conta não ativada. Verifique seu e-mail.");
    }
    return { user, role: userData.role };
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

export const setupAuthStateListener = () => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (user.emailVerified && !userData.isActive) {
          await updateDoc(doc(firestore, "users", user.uid), {
            isActive: true,
            emailVerified: true,
          });
        }
      }
    }
  });
};

export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.clear();
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};
