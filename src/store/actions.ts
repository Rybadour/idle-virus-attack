import { ActionType, IAction, MyCreateSlice } from "../shared/types";
import { NodesSlice } from "./nodes";
import { StatsSlice } from "./stats";
import programsWithIds, { ProgramId } from "../config/programs";

export interface ActionsSlice {
  queuedActions: IAction[],

  update: (elapsed: number) => void,
  queueAction: (action: IAction) => void,
}

const createActionsSlice: MyCreateSlice<ActionsSlice, [() => StatsSlice, () => NodesSlice]> = (set, get, stats, nodes) => {

  function startAction(action: IAction) {
    if (action.typeId.type === ActionType.Node) {
      nodes().startNodeAction(action.typeId.id);
    }
  }

  function applyProgram(c: ProgramId, elapsed: number) {
    const program = programsWithIds[c];
    const skillPower = stats().getSkill(program.requiredSkill);
    stats().addProtection(program.protectionProvided * skillPower * elapsed/1000);
  }

  return {
    queuedActions: [],

    update: (elapsed) => {
      const actions = [...get().queuedActions];
      if (actions.length <= 0) return;

      const newAction = {...actions[0]};
      newAction.current += stats().getSkill(newAction.requiredSkill) * elapsed/1000;
      stats().useSkill(newAction.requirement, newAction.requiredSkill, elapsed);
      if (newAction.typeId.type === ActionType.Program) {
        applyProgram(newAction.typeId.id, elapsed);
      }
      
      if (newAction.current >= newAction.requirement) {
        if (newAction.typeId.type === ActionType.Node) {
          nodes().completeNode(newAction.typeId.id);
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