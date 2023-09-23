import { start } from "repl";
import { ActionType, IAction, MyCreateSlice } from "../shared/types";
import { NodesSlice } from "./nodes";
import { StatsSlice } from "./stats";

export interface ActionsSlice {
  queuedActions: IAction[],

  update: (elapsed: number) => void,
  queueAction: (action: IAction) => void,
}

const createActionsSlice: MyCreateSlice<ActionsSlice, [() => StatsSlice, () => NodesSlice]> = (set, get, stats, nodes) => {

  function startAction(action: IAction) {
    if (action.type === ActionType.Node && action.relatedId) {
      nodes().startNodeAction(action.relatedId);
    }
  }

  return {
    queuedActions: [],

    update: (elapsed) => {
      const actions = [...get().queuedActions];
      if (actions.length <= 0) return;

      const newAction = {...actions[0]};
      newAction.current += stats().skills[newAction.requiredSkill] * elapsed/1000;
      stats().useSkill(newAction.requirement, newAction.requiredSkill, elapsed);
      
      if (newAction.current >= newAction.requirement) {
        if (newAction.type === ActionType.Node && newAction.relatedId) {
          nodes().completeNode(newAction.relatedId);
        }
        actions.splice(0, 1);
        if (actions.length > 0) {
          startAction(actions[0]);
        }
      } else {
        actions[0] = newAction;
      }
      set({ queuedActions: actions });
    },

    queueAction: (action: IAction) => {
      const newQueueActions = [...get().queuedActions, action];
      if (newQueueActions.length === 1) {
        startAction(action);
      }
      set({ queuedActions: newQueueActions })
    }
  }
};

export default createActionsSlice;