import { mapValues } from "lodash";
import programsWithIds, { ProgramConfig, ProgramId } from "../config/programs";
import { MyCreateSlice } from "../shared/types";
import { globals } from "../globals";

export interface RealizedProgram extends ProgramConfig {
  isEnabled: boolean,
}

export interface ProgramsSlice {
  programs: Record<ProgramId, RealizedProgram>,

  rewardProgram: (pid: ProgramId) => void, 
  reset: () => void,
}

const createProgramsSlice: MyCreateSlice<ProgramsSlice, []>
= (set, get) => {

  return {
    programs: mapValues(programsWithIds, (program) => ({
      ...program,
      isEnabled: globals.startingPrograms.includes(program.id),
    })),

    rewardProgram: (pid) => {
      set({ programs: mapValues(get().programs, (p) => {
        if (p.id === pid) {
          p.isEnabled = true;
        }
        return {...p};
      }) });
    },

    reset: () => {
      set({
        programs: mapValues(get().programs, (p) => ({
          ...p,
          isEnabled: globals.startingPrograms.includes(p.id),
        }))
      })
    }
  };
};

export default createProgramsSlice;