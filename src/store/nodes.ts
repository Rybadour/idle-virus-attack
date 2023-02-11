import { getNodes } from "../config/node-map";
import { INode, INodeProgress, MyCreateSlice, NodeLevel } from "../shared/types";
import { StatsSlice } from "./stats";

const NODE_STRENGTH = 10000;

export interface NodesSlice {
  nodes: Record<NodeLevel, Record<string, INode>>,
  nodeProgress?: INodeProgress;

  startMining: (nodeId: string, level: NodeLevel) => void,
  update: (elapsed: number) => void,
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
        progress.minedAmount += stats().hackingSkill * elapsed/1000;
        if (progress.minedAmount >= NODE_STRENGTH) {
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
          set({nodeProgress: progress});
        }
      }
    }
  }
};

export default createNodesSlice;