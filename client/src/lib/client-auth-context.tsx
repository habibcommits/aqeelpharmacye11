import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface ClientData {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
}

interface ClientAuthContextType {
  isAuthenticated: boolean;
  client: ClientData | null;
  login: (clientData: ClientData) => void;
  logout: () => void;
  updateClient: (clientData: Partial<ClientData>) => void;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

const STORAGE_KEY = "client_auth";

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [client, setClient] = useState<ClientData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const clientData = JSON.parse(stored);
        setClient(clientData);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (clientData: ClientData) => {
    setClient(clientData);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientData));
  };

  const logout = () => {
    setClient(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateClient = (clientData: Partial<ClientData>) => {
    if (client) {
      const updated = { ...client, ...clientData };
      setClient(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  return (
    <ClientAuthContext.Provider value={{ isAuthenticated, client, login, logout, updateClient }}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider");
  }
  return context;
}
