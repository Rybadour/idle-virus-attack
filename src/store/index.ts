import { createLens } from "@dhmk/zustand-lens";
import create from "zustand";

import createStatsSlice, { StatsSlice } from "./stats";

export type FullStore = {
  stats: StatsSlice,
}

const useStore = create<FullStore>((set, get) => {
  const stats = createLens(set, get, 'stats');

  return {
    stats: createStatsSlice(...stats),
  }
});

export default useStore;