import { auth, firestore } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithCredential,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";

export const signUp = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    await setDoc(doc(firestore, "users", user.uid), {
      name,
      email,
      emailVerified: false,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      throw new Error("Verifique seu e-mail para ativar a conta.");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(
      doc(firestore, "users", user.uid),
      {
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    const methods = await fetchSignInMethodsForEmail(auth, user.email);

    if (methods.length > 0 && methods.includes('password')) {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
      await linkWithCredential(userCredential.user, credential);
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const checkEmailVerification = async (user) => {
  await user.reload();
  if (user.emailVerified) {
    const userRef = doc(firestore, "users", user.uid);
    await updateDoc(userRef, { emailVerified: true });
    return true;
  }
  return false;
};
