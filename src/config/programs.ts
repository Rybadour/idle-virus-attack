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
  antiVirusReduction?: number,
  unlocksNode?: string,
  nodeSpeedUp?: {
    node: string,
    speedUp: number,
  },
  limitNum?: number,
}

const programsConfig = {
  decoys: {
    name: 'Decoy Executables',
    description: 'Create decoy programs to fool the anti-virus programs in this subnet.',
    requirement: 30,
    requiredSkill: SkillType.Spoofing,
    protectionProvided: 1,
  },
  DiscoverTeachersPassword: {
    name: 'Snoop Around on Mr. Garrison\'s Phone',
    description: 'Discover Mr. Garrisons\'s Password',
    requirement: 150,
    requiredSkill: SkillType.Hacking,
    nodeSpeedUp: {
      node: 'TeachersPC',
      speedUp: 10,
    },
    limitNum: 1,
  },
  ForceWindowsUpdate: {
    name: 'Force Windows Update',
    description: '',
    requirement: 300,
    requiredSkill: SkillType.Spoofing,
    maxProtectionMultiplier: 1.5,
  },
  AntiVirusDef: {
    name: 'Change Anti-virus Definition File',
    description: '',
    requirement: 500,
    requiredSkill: SkillType.Spoofing,
    antiVirusReduction: 2,
    limitNum: 1,
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