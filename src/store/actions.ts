import { ActionType, IAction, MyCreateSlice } from "../shared/types";
import { NodesSlice } from "./nodes";
import { StatsSlice } from "./stats";
import programsWithIds, { ProgramId } from "../config/programs";
import { globals } from "../globals";
import { ProgramsSlice } from "./programs";

export interface IActionCompletion {
  stopRepeat: boolean;
}

export interface ActionsSlice {
  queuedActions: IAction[],
  nodeSpeedUps: Record<string, number>,

  update: (elapsed: number) => void,
  queueAction: (action: IAction) => void,
  reset: () => void,
}

const createActionsSlice: MyCreateSlice<ActionsSlice, [() => StatsSlice, () => NodesSlice, () => ProgramsSlice]> = 
(set, get, stats, nodes, programs) => {

  function startAction(action: IAction) {
    if (action.typeId.type === ActionType.Node) {
      nodes().startNodeAction(action.typeId.id);
    }
  }

  function applyProgram(c: ProgramId, elapsed: number) {
    const program = programsWithIds[c];
    const skillPower = stats().getSkill(program.requiredSkill);
    if (program.protectionProvided) {
      const totalDuration = (program.requirement / skillPower);
      // Change to continuous calculations
      if (totalDuration <= 1) {
        const speed = program.protectionProvided / totalDuration;
        stats().addProtection(speed * elapsed/1000);
      }
    }
  }

  function applyProgramOnComplete(c: ProgramId): IActionCompletion {
    const completion = {stopRepeat: false};
    const program = programsWithIds[c];
    if (program.maxProtectionMultiplier) {
      stats().multiplyMaxProtection(program.maxProtectionMultiplier);
    } else if (program.antiVirusReduction) {
      stats().multiplyAntiVirus(1 / program.antiVirusReduction);
    } else if (program.nodeSpeedUp) {
      const newNodeSpeedUps = {...get().nodeSpeedUps};
      if (!newNodeSpeedUps[program.nodeSpeedUp.node]) {
        newNodeSpeedUps[program.nodeSpeedUp.node] = 1;
      }
      newNodeSpeedUps[program.nodeSpeedUp.node] *= program.nodeSpeedUp.speedUp;
      set({ nodeSpeedUps: newNodeSpeedUps });
    } else if (program.protectionProvided) {
      const skillPower = stats().getSkill(program.requiredSkill);
      const totalDuration = (program.requirement / skillPower);
      // Change to continuous calculations
      if (totalDuration > 1) {
        stats().addProtection(program.protectionProvided);
      }
      if (stats().protection >= stats().maxProtection) {
        completion.stopRepeat = true;
      }
    }
    return completion;
  }

  return {
    queuedActions: [],
    nodeSpeedUps: {},

    update: (elapsed) => {
      const actions = [...get().queuedActions];
      if (actions.length <= 0) return;

      elapsed *= globals.GAME_SPEED;

      const newAction = {...actions[0]};
      let bonus = 1;
      if (newAction.typeId.type === ActionType.Node) {
        const node = nodes().getNode(newAction.typeId.id);
        if (get().nodeSpeedUps[node.idName ?? '']) {
          bonus = get().nodeSpeedUps[node.idName ?? ''];
        }
      }
      newAction.current += stats().getSkill(newAction.requiredSkill) * elapsed/1000 * bonus;
      stats().useSkill(newAction.requirement, newAction.requiredSkill, elapsed);

      if (newAction.typeId.type === ActionType.Program) {
        applyProgram(newAction.typeId.id, elapsed);
      }
      
      if (newAction.current >= newAction.requirement) {
        let repeatAction = false;
        if (newAction.typeId.type === ActionType.Node) {
          nodes().completeNode(newAction.typeId.id);
        } else if (newAction.typeId.type === ActionType.Program) {
          const programId = newAction.typeId.id;
          const actionCompletion = applyProgramOnComplete(programId);
          programs().completeProgram(programId);
          repeatAction = !actionCompletion.stopRepeat && !!programsWithIds[programId].autoRepeat;
        }

        if (repeatAction) {
          resetAction(newAction);
          actions[0] = newAction;
        } else {
          actions.splice(0, 1);
        }
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
    },

    reset: () => {
      set({ queuedActions: [] });
    }
  }
};

function resetAction(action: IAction) {
  action.current = 0;
}

export default createActionsSlice;