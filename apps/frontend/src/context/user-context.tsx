import React, { createContext, useContext, useState, useEffect } from "react";
import { createUser } from "@/api/transactions";

type User = {
  id: string;
  name: string;
};

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  isLoading: boolean;
  createNewUser: (name: string, initialBalance?: number) => Promise<User>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on component mount
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const saveUserToLocalStorage = (user: User) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
  };

  const createNewUser = async (name: string, initialBalance?: number) => {
    try {
      const newUser = await createUser(name, initialBalance);
      const user = { id: newUser.id, name: newUser.name };
      saveUserToLocalStorage(user);
      return user;
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser: saveUserToLocalStorage,
        isLoading,
        createNewUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
