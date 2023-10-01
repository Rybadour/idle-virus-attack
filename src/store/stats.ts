import { cloneDeep } from "lodash";
import { MyCreateSlice, SkillType } from "../shared/types";
import { globals } from "../globals";

export interface StatsSlice {
  skills: Record<SkillType, number>;
  permanentSkills: Record<SkillType, number>;
  protection: number;
  maxProtection: number;
  maxProtectionMulti: number;
  antiVirusStrength: number;
  nextProtectionOnReset: number;
  lastAddedMaxProtection: number;

  getSkill: (skill: SkillType) => number,

  useSkill: (requirement: number, skill: SkillType, elapsed: number) => void,
  addProtection: (protection: number) => void,
  multiplyMaxProtection: (multi: number) => void,
  multiplyAntiVirus: (multi: number) => void,
  reset: () => void,
}

const startingSkills: Record<SkillType, number> = {
  [SkillType.Hacking]: 10,
  [SkillType.Spoofing]: 10,
  [SkillType.Firewall]: 10,
}

const createStatsSlice: MyCreateSlice<StatsSlice, []> = (set, get) => {
  return {
    skills: cloneDeep(startingSkills),
    permanentSkills: {
      [SkillType.Hacking]: 0,
      [SkillType.Spoofing]: 0,
      [SkillType.Firewall]: 0,
    },
    protection: globals.STARTING_MAX_PROTECTION,
    maxProtection: globals.STARTING_MAX_PROTECTION,
    maxProtectionMulti: 1,
    antiVirusStrength: globals.STARTING_ANTI_VIRUS,
    nextProtectionOnReset: 0,
    lastAddedMaxProtection: 0,

    getSkill: (skill: SkillType) => {
      const {skills, permanentSkills} = get();
      return skills[skill] + permanentSkills[skill];
    },

    useSkill: (requirement: number, skill: SkillType, elapsed: number) => {
      const perSec = elapsed/1000;
      const newSkills = {...get().skills};
      const improvement = newSkills[skill] * globals.IMPROVEMENT_SKILL_RATIO * perSec;
      newSkills[skill] += improvement;

      const newPermanentSkills = {...get().permanentSkills};
      newPermanentSkills[skill] += improvement * globals.PERMANENT_IMPROVEMENT_RATIO;

      const avStr = get().antiVirusStrength * (1 + globals.ANTI_VIRUS_STRENGTH_INCREASE * perSec);
      set({
        skills: newSkills,
        permanentSkills: newPermanentSkills,
        protection: get().protection - avStr * perSec,
        antiVirusStrength: avStr,
        nextProtectionOnReset: get().nextProtectionOnReset + perSec,
      });
    },

    addProtection: (protection: number) => {
      set({ protection: Math.min(get().protection + protection, get().maxProtection) });
    },

    multiplyMaxProtection: (multi: number) => {
      const newMaxProt = get().maxProtection * multi;
      const maxDiff = newMaxProt - get().maxProtection;
      set({
        maxProtection: newMaxProt,
        maxProtectionMulti: get().maxProtectionMulti * multi,
        protection: get().protection + maxDiff,
      });
    },

    multiplyAntiVirus: (multi: number) => {
      set({
        antiVirusStrength: get().antiVirusStrength * multi,
      });
    },

    reset: () => {
      const flatMax = get().maxProtection / get().maxProtectionMulti;
      const addedMax = (Math.log2(get().nextProtectionOnReset) / 100) * flatMax;
      const newMax = flatMax + addedMax;
      set({ 
        skills: cloneDeep(startingSkills),
        protection: newMax,
        maxProtection: newMax,
        maxProtectionMulti: 1,
        antiVirusStrength: globals.STARTING_ANTI_VIRUS,
        nextProtectionOnReset: 0,
        lastAddedMaxProtection: addedMax,
      });
    }
  }
};

export default createStatsSlice;