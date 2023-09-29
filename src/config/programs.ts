import { mapValues } from "lodash";
import { SkillType } from "../shared/types";

export interface ProgramConfig {
  id: ProgramId,
  name: string,
  description: string,
  requirement: number,
  requiredSkill: SkillType,
  protectionProvided?: number,
  maxProtectionMultiplier?: number,
}

const programsConfig = {
  decoys: {
    name: 'Decoy Executables',
    description: '',
    requirement: 30,
    requiredSkill: SkillType.Spoofing,
    protectionProvided: 1,
  },
  ForceWindowsUpdate: {
    name: 'Force Windows Update',
    description: '',
    requirement: 300,
    requiredSkill: SkillType.Spoofing,
    maxProtectionMultiplier: 1.5,
  },
  StealMoney: {
    name: 'Steal Money',
    description: '',
    requirement: 300,
    requiredSkill: SkillType.Spoofing,
    protectionProvided: 2,
  },
} satisfies Record<string, Omit<ProgramConfig, "id">>;;

export type ProgramId = keyof typeof programsConfig;

const programsWithIds: Record<ProgramId, ProgramConfig> = mapValues(programsConfig, (program, key) => {
  const id = key as ProgramId;

  return {
    ...program,
    id,
  }
});

export default programsWithIds;