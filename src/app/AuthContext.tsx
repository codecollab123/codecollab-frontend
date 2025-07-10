'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

import { setUser, clearUser } from '@/lib/userSlice';
import { initializeAxiosWithToken } from '@/lib/axiosinstance';
import { auth } from '@/config/firebaseConfig';

interface AuthContextProps {
  user: SerializableUser | null;
  loading: boolean;
}

interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  type: unknown;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUserState] = useState<SerializableUser | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        const parsedUser: SerializableUser = JSON.parse(storedUser);
        setUserState(parsedUser);
        initializeAxiosWithToken(storedToken);
        dispatch(setUser(parsedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      setLoading(false);
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const accessToken = await firebaseUser.getIdToken();
          const claims = await firebaseUser.getIdTokenResult();

          // ✅ Now userData has the correct type
          const userData: SerializableUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            phoneNumber: firebaseUser.phoneNumber,
            type: claims.claims.type,
          };

          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', accessToken);
          setUserState(userData);
          initializeAxiosWithToken(accessToken);
          dispatch(setUser(userData));
        } catch (error) {
          console.error('Error processing Firebase user:', error);
        }
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUserState(null);
        dispatch(clearUser());
        router.replace('/home/front');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
