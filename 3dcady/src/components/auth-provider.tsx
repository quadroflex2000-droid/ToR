'use client';

import { createContext, useContext, useState } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface MockSession {
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
}

const AuthContext = createContext<{
  session: MockSession;
  loading: boolean;
}>({ session: { user: null }, loading: false });

export function useSession() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Mock user session for development
  const [session] = useState<MockSession>({
    user: {
      id: 'mock-user-1',
      email: 'user@3dcady.com',
      name: 'Demo User'
    }
  });
  const [loading] = useState(false);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}