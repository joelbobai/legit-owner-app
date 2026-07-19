import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react";
import * as SecureStore from "expo-secure-store";

type User = {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth?: string;
  stateOfResidence?: string;
  role?: string;
  emailVerified?: boolean;
  faceVerified?: boolean;
  verificationStatus?: string;
  profilePhoto?: string;
  memberSince?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEYS = {
  token: "authToken",
  user: "user",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          SecureStore.getItemAsync(STORAGE_KEYS.token),
          SecureStore.getItemAsync(STORAGE_KEYS.user),
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.token);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.user);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredAuth();
  }, []);

  const login = useCallback(async (newToken: string, newUser: User) => {
    await Promise.all([
      SecureStore.setItemAsync(STORAGE_KEYS.token, newToken),
      SecureStore.setItemAsync(STORAGE_KEYS.user, JSON.stringify(newUser)),
    ]);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.token),
      SecureStore.deleteItemAsync(STORAGE_KEYS.user),
    ]);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isLoggedIn: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
