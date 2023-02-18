import { IAction, MyCreateSlice, SkillType } from "../shared/types";

export interface StatsSlice {
  skills: Record<SkillType, number>;
  protection: number;
  maxProtection: number;
  antiVirusStrength: number;

  doAction: (action: IAction, elapsed: number) => IAction,
}

const STRENGTH_SKILL_RATIO = 0.01;
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

    doAction: (action, elapsed) => {
      const newSkills = {...get().skills};
      const newAction = {...action};
      const progress = newSkills[action.requiredSkill] * STRENGTH_SKILL_RATIO * elapsed/1000;
      newSkills[action.requiredSkill] += progress;
      newAction.current += progress;

      const avStr = get().antiVirusStrength * (1 + ANTI_VIRUS_STRENGTH_INCREASE * elapsed/1000);
      set({
        skills: newSkills,
        protection: get().protection - avStr * elapsed/1000,
        antiVirusStrength: avStr,
      });

      return newAction;
    },
  }
};

export default createStatsSlice;