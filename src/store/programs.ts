import { mapValues } from "lodash";
import programsWithIds, { ProgramConfig, ProgramId } from "../config/programs";
import { MyCreateSlice } from "../shared/types";
import { globals } from "../globals";

export interface RealizedProgram extends ProgramConfig {
  isEnabled: boolean,
  numCompleted: number,
}

export interface ProgramsSlice {
  programs: Record<ProgramId, RealizedProgram>,

  rewardProgram: (pid: ProgramId) => void, 
  completeProgram: (pid: ProgramId) => void,
  reset: () => void,
}

const createProgramsSlice: MyCreateSlice<ProgramsSlice, []>
= (set, get) => {

  return {
    programs: mapValues(programsWithIds, (program) => ({
      ...program,
      isEnabled: globals.startingPrograms.includes(program.id),
      numCompleted: 0,
    })),

    rewardProgram: (pid) => {
      set({ programs: mapValues(get().programs, (p) => {
        if (p.id === pid) {
          p.isEnabled = true;
        }
        return {...p};
      }) });
    },

    completeProgram: (pid) => {
      const newPrograms = mapValues(get().programs, (p) => {
        if (p.id === pid) {
          p.numCompleted++;
          if (p.limitNum && p.numCompleted >= p.limitNum) {
            p.isEnabled = false;
          }
        }
        return {...p};
      });
      set({ programs: newPrograms });
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