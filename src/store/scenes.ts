import _, { cloneDeep } from "lodash";
import { MyCreateSlice } from "../shared/types";

export interface ScenesSlice {
  isReseting: boolean,

  startReset: () => void,
  restart: () => void,
}

const createScenesSlice: MyCreateSlice<ScenesSlice, []>
= (set, get) => {

  return {
    isReseting: false,

    startReset: () => {
      set({ isReseting: true });
    },

    restart: () => {
      set({ isReseting: false });
    }
  };
};

export default createScenesSlice;