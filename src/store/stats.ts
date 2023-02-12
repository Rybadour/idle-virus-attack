import { MyCreateSlice } from "../shared/types";

export interface StatsSlice {
  hackingSkill: number;
}

const createStatsSlice: MyCreateSlice<StatsSlice, []> = (set, get) => {
  return {
    hackingSkill: 100,
  }
};

export default createStatsSlice;