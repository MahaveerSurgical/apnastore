// src/hooks/useAuth.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  updateProfile,
} from '../firebase/firebaseConfig';
import { auth, googleProvider, db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/* -------------------------------------------------------------------------- */
/*                               LOGIN FUNCTION                               */
/* -------------------------------------------------------------------------- */
export const login = async (email: string, password: string, name?: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Ensure profile exists or update display name if missing
    await ensureWorkerProfile(user, name);
    return user;
  } catch (error: any) {
    console.error('Login failed:', error);
    throw new Error(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                               SIGNUP FUNCTION                              */
/* -------------------------------------------------------------------------- */
export const signup = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  try {
    // Create account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth displayName
    await updateProfile(user, { displayName: name });

    // Determine if role is immediately approved
    const isPending = role === 'Admin' || role === 'Delivery';
    const assignedRole = isPending ? null : role;

    // Create worker doc
    await setDoc(doc(db, 'workers', user.uid), {
      uid: user.uid,
      name,
      email,
      role: assignedRole,
      approved: !isPending,
      createdAt: serverTimestamp(),
    });

    return user;
  } catch (error: any) {
    console.error('Signup failed:', error);
    throw new Error(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                              LOGOUT FUNCTION                               */
/* -------------------------------------------------------------------------- */
export const logout = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Logout failed:', error);
    throw new Error(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                           GOOGLE LOGIN FUNCTION                            */
/* -------------------------------------------------------------------------- */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    await ensureWorkerProfile(user);
    return user;
  } catch (error: any) {
    console.error('Google login error:', error);
    throw new Error(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                  ENSURE WORKER PROFILE EXISTS OR CREATE ONE                */
/* -------------------------------------------------------------------------- */
const ensureWorkerProfile = async (user: any, name?: string) => {
  if (!user?.uid) return;

  const workerRef = doc(db, 'workers', user.uid);
  const snap = await getDoc(workerRef);

  if (snap.exists()) {
    // Update name if missing or outdated
    const data = snap.data();
    if (!data.name && name) {
      await setDoc(
        workerRef,
        { name, updatedAt: serverTimestamp() },
        { merge: true }
      );
    }
    return;
  }

  const displayName = name || user.displayName || user.email || 'User';
  await setDoc(workerRef, {
    uid: user.uid,
    name: displayName,
    email: user.email,
    role: 'Contract', // Default for unclassified users
    approved: true,
    createdAt: serverTimestamp(),
  });
};