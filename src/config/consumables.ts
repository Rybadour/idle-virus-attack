import { ConsumableConfig, SkillType } from "../shared/types";

const consumablesConfig: Record<string, ConsumableConfig> = {
  decoys: {
    name: 'Decoy Executables',
    description: '',
    requirement: 100,
    requiredSkill: SkillType.Spoofing,
    protectionProvided: 10,
  }
};

export default consumablesConfig;