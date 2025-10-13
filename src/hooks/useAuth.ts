// src/hooks/useAuth.ts
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from '../firebase/firebaseConfig';
import { auth, googleProvider, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier } from '../firebase/firebaseConfig';
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

/** Initialize reCAPTCHA verifier */
export const setupRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(
    auth,
    containerId,
    {
      size: 'invisible',
      callback: (response: unknown) => {
        console.log('reCAPTCHA verified:', response);
      },
    }
  );
};

/** Send OTP to phone number */
export const sendOTP = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult; // Save for later verification
  } catch (error: any) {
    console.error('Send OTP error:', error);
    throw new Error(error.message);
  }
};

/** Confirm OTP */
export const verifyOTP = async (confirmationResult: any, code: string) => {
  try {
    const userCredential = await confirmationResult.confirm(code);
    const user = userCredential.user;
    await ensureWorkerProfile(user);
    return user;
  } catch (error: any) {
    console.error('Verify OTP error:', error);
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
    phone: user.phoneNumber || null,
    createdAt: serverTimestamp(),
  });
};