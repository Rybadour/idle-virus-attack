import { cloneDeep } from "lodash";
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
  reset: () => void,
}

const startingSkills: Record<SkillType, number> = {
  [SkillType.Hacking]: 10,
  [SkillType.Spoofing]: 10,
  [SkillType.Firewall]: 10,
}

const IMPROVEMENT_SKILL_RATIO = 0.01;
const PERMANENT_IMPROVEMENT_RATIO = 0.2;
const ANTI_VIRUS_STRENGTH_INCREASE = 0.05;
const ANTI_VIRUS_START = 2;
const createStatsSlice: MyCreateSlice<StatsSlice, []> = (set, get) => {
  return {
    skills: cloneDeep(startingSkills),
    permanentSkills: {
      [SkillType.Hacking]: 0,
      [SkillType.Spoofing]: 0,
      [SkillType.Firewall]: 0,
    },
    protection: 200,
    maxProtection: 200,
    antiVirusStrength: ANTI_VIRUS_START,

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
    },

    reset: () => {
      set({ 
        skills: cloneDeep(startingSkills),
        protection: get().maxProtection,
        antiVirusStrength: ANTI_VIRUS_START,
      });
    }
  }
};

export default createStatsSlice;