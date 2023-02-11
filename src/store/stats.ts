import { MyCreateSlice } from "../shared/types";

export interface StatsSlice {
  hackingSkill: number;
}

const createStatsSlice: MyCreateSlice<StatsSlice, []> = (set, get) => {
  return {
    hackingSkill: 10,
  }
};

export default createStatsSlice;