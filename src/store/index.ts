import { createLens } from "@dhmk/zustand-lens";
import create from "zustand";

import createActionsSlice, { ActionsSlice } from "./actions";
import createNodesSlice, { NodesSlice } from "./nodes";
import createStatsSlice, { StatsSlice } from "./stats";
import createScenesSlice, { ScenesSlice } from "./scenes";

export type FullStore = {
  scenes: ScenesSlice,
  stats: StatsSlice,
  nodes: NodesSlice,
  actions: ActionsSlice,
}

const useStore = create<FullStore>((set, get) => {
  const scenes = createLens(set, get, 'scenes')
  const stats = createLens(set, get, 'stats');
  const nodes = createLens(set, get, 'nodes');
  const actions = createLens(set, get, 'actions');

  return {
    scenes: createScenesSlice(...scenes),
    stats: createStatsSlice(...stats),
    actions: createActionsSlice(...actions, stats[1], nodes[1]),
    nodes: createNodesSlice(...nodes, actions[1]),
  }
});

export default useStore;