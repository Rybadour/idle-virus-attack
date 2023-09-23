import _, { cloneDeep } from "lodash";
import { getNodes } from "../config/node-map";
import { ActionType, INode, INodeProgress, MyCreateSlice, NodeLevel, NodePathId } from "../shared/types";
import { ActionsSlice } from "./actions";

export interface NodesSlice {
  nodes: Record<NodeLevel, Record<string, INode>>,
  currentMap: NodeLevel,
  nodeProgress?: INodeProgress,

  queueMining: (nodeId: string, level: NodeLevel) => void,
  startNodeAction: (nodePath: NodePathId) => void,
  completeNode: (nodePath: NodePathId) => void,
  isConnectedCompleted: (nodeId: string, level: NodeLevel) => boolean,
  switchToSubnet: (subnet?: NodeLevel) => void,
}

const defaultNodes = {
  [NodeLevel.Internet]: getNodes(NodeLevel.Internet),
  [NodeLevel.HighSchool]: getNodes(NodeLevel.HighSchool),
};

const createNodesSlice: MyCreateSlice<NodesSlice, [() => ActionsSlice]>
= (set, get, actions) => {
  return {
    nodes: defaultNodes,
    currentMap: NodeLevel.Internet,
    nodeProgress: undefined,

    queueMining: (nodeId, level) => {
      const node = get().nodes[level][nodeId];
      actions().queueAction({
        name: "Node - " + node.name,
        typeId: {type: ActionType.Node, id: [level, nodeId]},
        requiredSkill: node.requiredSkill,
        current: 0,
        requirement: node.requirement,
      })
    },

    completeNode: ([level, nodeId]) => {
      const newNodes = cloneDeep(get().nodes);
      _.set(newNodes, `${level}.${nodeId}.isComplete`, true);

      set({ nodes: newNodes, nodeProgress: undefined });
    },

    startNodeAction: ([level, nodeId]) => {
      const node = get().nodes[level][nodeId];
      set({
        nodeProgress: {
          node,
          level,
        }
      });
    },

    isConnectedCompleted: (nodeId, level) => {
      const nodes = get().nodes[level];
      
      const found = Object.values(nodes).some((node) => 
        node.isComplete && node.connections.includes(nodeId)
      );

      return found;
    },

    switchToSubnet: (subnet) => {
      set({ currentMap: subnet });
    },
  };
};

export default createNodesSlice;