import { IAction, MyCreateSlice } from "../shared/types";
import { StatsSlice } from "./stats";

export interface ActionsSlice {
  queuedActions: IAction[],

  update: (elapsed: number) => void,
  queueAction: (action: IAction) => void,
}

const createActionsSlice: MyCreateSlice<ActionsSlice, [() => StatsSlice]> = (set, get, stats) => {
  return {
    queuedActions: [],

    update: (elapsed) => {
      const actions = get().queuedActions;
      if (actions.length <= 0) return;

      stats().doAction(actions[1], elapsed);
    },

    queueAction: (action) => {
      set({queuedActions: [...get().queuedActions, action]})
    }
  }
};

export default createActionsSlice;