import { create } from "zustand";
import type { UserSession } from "../types";

const SESSION_KEY = "kc_session";

type AuthStore = {
  session:    UserSession | null;
  isLoading:  boolean;
  initAuth:   () => void;
  setSession: (session: UserSession) => void;
  clearAuth:  () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  session:   null,
  isLoading: true,

  initAuth: () => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        const session = JSON.parse(raw) as UserSession;
        set({ session, isLoading: false });
      } catch {
        localStorage.removeItem(SESSION_KEY);
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  setSession: (session) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    set({ session });
  },

  clearAuth: () => {
    localStorage.removeItem(SESSION_KEY);
    set({ session: null });
  },
}));