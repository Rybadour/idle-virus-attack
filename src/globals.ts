import { ProgramId } from "./config/programs"

const startingPrograms: ProgramId[] = ['decoys'];

export const globals = {
  GAME_SPEED: 10,
  STARTING_ANTI_VIRUS: 0.5,
  STARTING_MAX_PROTECTION: 300,
  IMPROVEMENT_SKILL_RATIO: 0.005,
  PERMANENT_IMPROVEMENT_RATIO: 0.2,
  ANTI_VIRUS_STRENGTH_INCREASE: 0.01,
  BONUS_MAX_PROTECTION_MULTI: 1,
  startingPrograms,
};