import { createLens } from "@dhmk/zustand-lens";
import create from "zustand";
import createNodesSlice, { NodesSlice } from "./nodes";

import createStatsSlice, { StatsSlice } from "./stats";

export type FullStore = {
  stats: StatsSlice,
  nodes: NodesSlice,
}

const useStore = create<FullStore>((set, get) => {
  const stats = createLens(set, get, 'stats');
  const nodes = createLens(set, get, 'nodes');

  return {
    stats: createStatsSlice(...stats),
    nodes: createNodesSlice(...nodes, stats[1]),
  }
});

export default useStore;