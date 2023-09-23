import { MyCreateSlice, SkillType } from "../shared/types";

export interface StatsSlice {
  skills: Record<SkillType, number>;
  protection: number;
  maxProtection: number;
  antiVirusStrength: number;

  useSkill: (requirement: number, skill: SkillType, elapsed: number) => void,
  addProtection: (protection: number) => void,
}

const IMPROVEMENT_SKILL_RATIO = 0.01;
const ANTI_VIRUS_STRENGTH_INCREASE = 0.05;
const createStatsSlice: MyCreateSlice<StatsSlice, []> = (set, get) => {
  return {
    skills: {
      [SkillType.Hacking]: 100,
      [SkillType.Spoofing]: 10,
      [SkillType.Firewall]: 100,
    },
    protection: 200,
    maxProtection: 200,
    antiVirusStrength: 2,

    useSkill: (requirement: number, skill: SkillType, elapsed: number) => {
      const perSec = elapsed/1000;
      const newSkills = {...get().skills};
      const improvement = newSkills[skill] * IMPROVEMENT_SKILL_RATIO * perSec;
      newSkills[skill] += improvement;

      const avStr = get().antiVirusStrength * (1 + ANTI_VIRUS_STRENGTH_INCREASE * perSec);
      set({
        skills: newSkills,
        protection: get().protection - avStr * perSec,
        antiVirusStrength: avStr,
      });
    },

    addProtection: (protection: number) => {
      set({ protection: Math.min(get().protection + protection, get().maxProtection) });
    }
  }
};

export default createStatsSlice;