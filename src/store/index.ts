import { createLens } from "@dhmk/zustand-lens";
import create from "zustand";

import createActionsSlice, { ActionsSlice } from "./actions";
import createNodesSlice, { NodesSlice } from "./nodes";
import createStatsSlice, { StatsSlice } from "./stats";

export type FullStore = {
  stats: StatsSlice,
  nodes: NodesSlice,
  actions: ActionsSlice,
}

const useStore = create<FullStore>((set, get) => {
  const stats = createLens(set, get, 'stats');
  const nodes = createLens(set, get, 'nodes');
  const actions = createLens(set, get, 'actions');

  return {
    stats: createStatsSlice(...stats),
    actions: createActionsSlice(...actions, stats[1]),
    nodes: createNodesSlice(...nodes, stats[1], actions[1]),
  }
});

export default useStore;