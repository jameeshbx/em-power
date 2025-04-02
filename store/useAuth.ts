import { create } from "zustand";

type AuthState = {
  user: { id: string; email: string; role: string; name: string } | null;
  setUser: (
    user: { id: string; email: string; role: string; name: string } | null
  ) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
