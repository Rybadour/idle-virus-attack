import { MyCreateSlice, SkillType } from "../shared/types";

export interface StatsSlice {
  skills: Record<SkillType, number>;

  useSkill: (nodeStrength: number, skill: SkillType, elapsed: number) => void,
}

const STRENGTH_SKILL_RATIO = 0.01;
const createStatsSlice: MyCreateSlice<StatsSlice, []> = (set, get) => {
  return {
    skills: {
      [SkillType.Hacking]: 100,
      [SkillType.Spoofing]: 10,
      [SkillType.Firewall]: 100,
    },

    useSkill: (nodeStrength, skill, elapsed) => {
      const newSkills = {...get().skills};
      newSkills[skill] += nodeStrength * STRENGTH_SKILL_RATIO * elapsed/1000;
      set({ skills: newSkills });
    },
  }
};

export default createStatsSlice;