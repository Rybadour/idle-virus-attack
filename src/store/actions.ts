import { ActionType, IAction, MyCreateSlice } from "../shared/types";
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
      if (actions.length <= 0 || actions[0].type === ActionType.Node) return;

      const newAction = {...actions[0]};
      newAction.current += stats().skills[newAction.requiredSkill] * elapsed/1000;
      actions[0] = newAction;
      set({ queuedActions: [...actions] });
    },

    queueAction: (action) => {
      set({ queuedActions: [...get().queuedActions, action] })
    }
  }
};

export default createActionsSlice;