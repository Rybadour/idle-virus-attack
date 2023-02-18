import { getNodes } from "../config/node-map";
import { ActionType, INode, INodeProgress, MyCreateSlice, NodeLevel } from "../shared/types";
import { ActionsSlice } from "./actions";
import { StatsSlice } from "./stats";

export interface NodesSlice {
  nodes: Record<NodeLevel, Record<string, INode>>,
  nodeProgress?: INodeProgress;

  startMining: (nodeId: string, level: NodeLevel) => void,
  update: (elapsed: number) => void,
  isConnectedCompleted: (nodeId: string, level: NodeLevel) => boolean,
}

const createNodesSlice: MyCreateSlice<NodesSlice, [() => StatsSlice, () => ActionsSlice]>
= (set, get, stats, actions) => {
  return {
    nodes: {
      [NodeLevel.Internet]: getNodes(NodeLevel.Internet),
      [NodeLevel.Infranet]: getNodes(NodeLevel.Infranet),
      [NodeLevel.Computer]: getNodes(NodeLevel.Computer),
    },
    nodeProgress: undefined,

    startMining: (nodeId, level) => {
      const node = get().nodes[level][nodeId];
      set({
        nodeProgress: {
          node,
          level,
          minedAmount: 0,
        }
      });
      actions().queueAction({
        name: "Node - " + node.name,
        type: ActionType.Node,
        requiredSkill: node.requiredSkill,
        current: 0,
        requirement: node.requirement,
        relatedId: node.id,
      })
    },

    update: (elapsed) => {
      const progress = get().nodeProgress;
      if (progress) {
        const newProgress = {...progress};
        newProgress.minedAmount += stats().skills[progress.node.requiredSkill] * elapsed/1000;
        stats().useSkill(progress.node.requirement, progress.node.requiredSkill, elapsed);
        if (newProgress.minedAmount >= progress.node.requirement) {
          set({
            nodes: {
              ...get().nodes,
              [progress.level]: {
                ...get().nodes[progress.level],
                [progress.node.id]: {
                  ...get().nodes[progress.level][progress.node.id],
                  isComplete: true,
                }
              }
            },
            nodeProgress: undefined
          });
        } else {
          set({nodeProgress: newProgress});
        }
      }
    },

    isConnectedCompleted: (nodeId, level) => {
      const nodes = get().nodes[level];
      
      const found = Object.values(nodes).some((node) => 
        node.isComplete && node.connections.includes(nodeId)
      );

      return found;
    }
  };
};

export default createNodesSlice;