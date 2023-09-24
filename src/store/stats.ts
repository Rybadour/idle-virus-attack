import { MyCreateSlice, SkillType } from "../shared/types";

export interface StatsSlice {
  skills: Record<SkillType, number>;
  permanentSkills: Record<SkillType, number>;
  protection: number;
  maxProtection: number;
  antiVirusStrength: number;

  getSkill: (skill: SkillType) => number,

  useSkill: (requirement: number, skill: SkillType, elapsed: number) => void,
  addProtection: (protection: number) => void,
}

const IMPROVEMENT_SKILL_RATIO = 0.01;
const PERMANENT_IMPROVEMENT_RATIO = 0.2;
const ANTI_VIRUS_STRENGTH_INCREASE = 0.05;
const createStatsSlice: MyCreateSlice<StatsSlice, []> = (set, get) => {
  return {
    skills: {
      [SkillType.Hacking]: 10,
      [SkillType.Spoofing]: 10,
      [SkillType.Firewall]: 10,
    },
    permanentSkills: {
      [SkillType.Hacking]: 0,
      [SkillType.Spoofing]: 0,
      [SkillType.Firewall]: 0,
    },
    protection: 200,
    maxProtection: 200,
    antiVirusStrength: 2,

    getSkill: (skill: SkillType) => {
      const {skills, permanentSkills} = get();
      return skills[skill] + permanentSkills[skill];
    },

    useSkill: (requirement: number, skill: SkillType, elapsed: number) => {
      const perSec = elapsed/1000;
      const newSkills = {...get().skills};
      const improvement = newSkills[skill] * IMPROVEMENT_SKILL_RATIO * perSec;
      newSkills[skill] += improvement;

      const newPermanentSkills = {...get().permanentSkills};
      newPermanentSkills[skill] += improvement * PERMANENT_IMPROVEMENT_RATIO;

      const avStr = get().antiVirusStrength * (1 + ANTI_VIRUS_STRENGTH_INCREASE * perSec);
      set({
        skills: newSkills,
        permanentSkills: newPermanentSkills,
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