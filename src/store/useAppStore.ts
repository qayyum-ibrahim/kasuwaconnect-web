import { create } from "zustand";
import type { Trader, JobSeeker } from "../types";

type AppStore = {
  trader: Trader | null;
  seeker: JobSeeker | null;
  setTrader: (trader: Trader) => void;
  setSeeker: (seeker: JobSeeker) => void;
  clearApp: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  trader: null,
  seeker: null,
  setTrader: (trader) => set({ trader }),
  setSeeker: (seeker) => set({ seeker }),
  clearApp: () => set({ trader: null, seeker: null }),
}));
