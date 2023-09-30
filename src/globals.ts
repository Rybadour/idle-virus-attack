import { ProgramId } from "./config/programs"

const startingPrograms: ProgramId[] = ['decoys'];

export const globals = {
  GAME_SPEED: 1,
  STARTING_ANTI_VIRUS: 1,
  STARTING_MAX_PROTECTION: 300,
  IMPROVEMENT_SKILL_RATIO: 0.01,
  PERMANENT_IMPROVEMENT_RATIO: 0.2,
  ANTI_VIRUS_STRENGTH_INCREASE: 0.05,
  startingPrograms,
};