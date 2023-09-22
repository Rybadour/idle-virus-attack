import { IAction, MyCreateSlice, SkillType } from "../shared/types";

export interface StatsSlice {
  skills: Record<SkillType, number>;
  protection: number;
  maxProtection: number;
  antiVirusStrength: number;

  useSkill: (requirement: number, skill: SkillType, elapsed: number) => void,
}

const IMPROVEMENT_SKILL_RATIO = 0.01;
const ANTI_VIRUS_STRENGTH_INCREASE = 0.01;
const createStatsSlice: MyCreateSlice<StatsSlice, []> = (set, get) => {
  return {
    skills: {
      [SkillType.Hacking]: 100,
      [SkillType.Spoofing]: 10,
      [SkillType.Firewall]: 100,
    },
    protection: 1000,
    maxProtection: 1000,
    antiVirusStrength: 2,

    useSkill: (requirement: number, skill: SkillType, elapsed: number) => {
      const newSkills = {...get().skills};
      const improvement = newSkills[skill] * IMPROVEMENT_SKILL_RATIO * elapsed/1000;
      newSkills[skill] += improvement;

      const avStr = get().antiVirusStrength * (1 + ANTI_VIRUS_STRENGTH_INCREASE * elapsed/1000);
      set({
        skills: newSkills,
        protection: get().protection - avStr * elapsed/1000,
        antiVirusStrength: avStr,
      });
    },
  }
};

export default createStatsSlice;