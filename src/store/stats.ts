import { MyCreateSlice } from "../shared/types";

export interface StatsSlice {
  hackingSkill: number;

  useSkill: (nodeStrength: number, elapsed: number) => void,
}

const STRENGTH_SKILL_RATIO = 0.01;
const createStatsSlice: MyCreateSlice<StatsSlice, []> = (set, get) => {
  return {
    hackingSkill: 100,

    useSkill: (nodeStrength, elapsed) => {
      set({hackingSkill: get().hackingSkill + nodeStrength * STRENGTH_SKILL_RATIO * elapsed/1000})
    },
  }
};

export default createStatsSlice;