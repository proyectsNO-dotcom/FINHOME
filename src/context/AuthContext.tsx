import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  sendPasswordResetEmail, 
  signOut, 
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { UserProfile } from '../types';
import { authRateLimiter, isValidEmail, sanitizeText } from '../utils/security';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  error: string | null;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (email: string, pass: string, displayName: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'finhome_guest_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem(GUEST_STORAGE_KEY) === 'true';
  });
  const [error, setError] = useState<string | null>(null);

  // Asegurar persistencia local segura de sesión
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(err => {
      console.warn('Error configurando persistencia de sesión:', err);
    });
  }, []);

  // Escuchar cambios de estado en Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsGuest(false);
        localStorage.removeItem(GUEST_STORAGE_KEY);
        setUserProfile({
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario',
          photoURL: currentUser.photoURL || undefined,
          activeHouseholdId: null
        });
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const translateAuthError = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Credenciales inválidas. Por favor verifica tu correo y contraseña.';
      case 'auth/email-already-in-use':
        return 'Este correo electrónico ya se encuentra registrado.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-email':
        return 'El formato de correo electrónico es inválido.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Por seguridad, la cuenta se ha bloqueado temporalmente. Intenta más tarde.';
      case 'auth/popup-closed-by-user':
        return 'Se cerró la ventana de autenticación con Google antes de completar.';
      default:
        return 'Ocurrió un error al procesar la autenticación. Intenta nuevamente.';
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    const cleanEmail = email.trim();

    if (!isValidEmail(cleanEmail)) {
      setError('Por favor ingresa un correo electrónico válido.');
      return false;
    }

    // Rate Limiting en cliente (prevención de ataques de fuerza bruta)
    const rateCheck = authRateLimiter.checkLimit(cleanEmail, 5, 30);
    if (!rateCheck.allowed) {
      setError(`Demasiados intentos fallidos. Por favor espera ${rateCheck.waitSeconds} segundos antes de reintentar.`);
      return false;
    }

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
      authRateLimiter.reset(cleanEmail);
      setIsGuest(false);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      return true;
    } catch (err: any) {
      authRateLimiter.recordFailure(cleanEmail, 5, 30);
      setError(translateAuthError(err.code));
      return false;
    }
  };

  const registerWithEmail = async (email: string, pass: string, displayName: string): Promise<boolean> => {
    setError(null);
    const cleanEmail = email.trim();
    const cleanName = sanitizeText(displayName, 50);

    if (!isValidEmail(cleanEmail)) {
      setError('Por favor ingresa un correo electrónico válido.');
      return false;
    }

    if (pass.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (cleanName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: cleanName });
      }
      setIsGuest(false);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      return true;
    } catch (err: any) {
      setError(translateAuthError(err.code));
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      setIsGuest(false);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      return true;
    } catch (err: any) {
      setError(translateAuthError(err.code));
      return false;
    }
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    setError(null);
    const cleanEmail = email.trim();

    if (!isValidEmail(cleanEmail)) {
      setError('Por favor ingresa un correo electrónico válido.');
      return false;
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return true;
    } catch (err: any) {
      setError(translateAuthError(err.code));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setIsGuest(false);
      localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch (err: any) {
      setError(translateAuthError(err.code));
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem(GUEST_STORAGE_KEY, 'true');
    setUserProfile({
      uid: 'guest_user',
      email: 'invitado@finhome.local',
      displayName: 'Invitado',
      activeHouseholdId: null
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      isGuest,
      error,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      requestPasswordReset,
      logout,
      continueAsGuest,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
