import { getNodes } from "../config/node-map";
import { INode, INodeProgress, MyCreateSlice, NodeLevel } from "../shared/types";
import { StatsSlice } from "./stats";

export const NODE_STRENGTH = 1000;

export interface NodesSlice {
  nodes: Record<NodeLevel, Record<string, INode>>,
  nodeProgress?: INodeProgress;

  startMining: (nodeId: string, level: NodeLevel) => void,
  update: (elapsed: number) => void,
  isConnectedCompleted: (nodeId: string, level: NodeLevel) => boolean,
}

const createNodesSlice: MyCreateSlice<NodesSlice, [() => StatsSlice]> = (set, get, stats) => {
  return {
    nodes: {
      [NodeLevel.Internet]: getNodes(NodeLevel.Internet),
      [NodeLevel.Infranet]: getNodes(NodeLevel.Infranet),
      [NodeLevel.Computer]: getNodes(NodeLevel.Computer),
    },
    nodeProgress: undefined,

    startMining: (nodeId, level) => {
      set({
        nodeProgress: {
          nodeId,
          level,
          minedAmount: 0,
        }
      })
    },

    update: (elapsed) => {
      const progress = get().nodeProgress;
      if (progress) {
        const newProgress = {...progress};
        newProgress.minedAmount += stats().hackingSkill * elapsed/1000;
        stats().useSkill(NODE_STRENGTH, elapsed);
        if (newProgress.minedAmount >= NODE_STRENGTH) {
          set({
            nodes: {
              ...get().nodes,
              [progress.level]: {
                ...get().nodes[progress.level],
                [progress.nodeId]: {
                  ...get().nodes[progress.level][progress.nodeId],
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