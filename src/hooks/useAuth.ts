// src/hooks/useAuth.ts
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from '../firebase/firebaseConfig';
import { auth, googleProvider, signInWithPopup } from '../firebase/firebaseConfig';
import { db, doc, getDoc, setDoc, serverTimestamp } from '../firebase/firebaseConfig';

/**
 * Log in a user with email and password
 * @param email 
 * @param password 
 */
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await ensureWorkerProfile(user);
    return user;
  } catch (error: any) {
    console.error('Login failed:', error);
    throw new Error(error.message);
  }
};

/**
 * Log out the currently authenticated user
 */
export const logout = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Logout failed:', error);
    throw new Error(error.message);
  }
};

/** Google Sign-In */
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


/** Ensure a worker profile exists for the signed-in user */
const ensureWorkerProfile = async (user: any) => {
  if (!user?.uid) return;
  const workerRef = doc(db, 'workers', user.uid);
  const snap = await getDoc(workerRef);
  if (snap.exists()) return;
  const displayName: string = user.displayName || user.email || 'User';
  await setDoc(workerRef, {
    uid: user.uid,
    name: displayName,
    role: 'Contract',
    createdAt: serverTimestamp(),
  });
};