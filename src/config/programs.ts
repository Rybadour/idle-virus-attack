import { mapValues } from "lodash";
import { ProgramConfig, SkillType } from "../shared/types";

const programsConfig = {
  decoys: {
    name: 'Decoy Executables',
    description: '',
    requirement: 30,
    requiredSkill: SkillType.Spoofing,
    protectionProvided: 1,
  }
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