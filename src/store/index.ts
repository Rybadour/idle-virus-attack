import { createLens } from "@dhmk/zustand-lens";
import create from "zustand";

import createActionsSlice, { ActionsSlice } from "./actions";
import createNodesSlice, { NodesSlice } from "./nodes";
import createStatsSlice, { StatsSlice } from "./stats";
import createScenesSlice, { ScenesSlice } from "./scenes";
import createProgramsSlice, { ProgramsSlice } from "./programs";

export type FullStore = {
  scenes: ScenesSlice,
  stats: StatsSlice,
  nodes: NodesSlice,
  actions: ActionsSlice,
  programs: ProgramsSlice,
}

const useStore = create<FullStore>((set, get) => {
  const scenes = createLens(set, get, 'scenes');
  const stats = createLens(set, get, 'stats');
  const nodes = createLens(set, get, 'nodes');
  const actions = createLens(set, get, 'actions');
  const programs = createLens(set, get, 'programs');

  return {
    scenes: createScenesSlice(...scenes),
    stats: createStatsSlice(...stats),
    nodes: createNodesSlice(...nodes, actions[1], programs[1]),
    actions: createActionsSlice(...actions, stats[1], nodes[1]),
    programs: createProgramsSlice(...programs),
  }
});

export default useStore;