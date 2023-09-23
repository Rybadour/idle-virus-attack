import _, { cloneDeep } from "lodash";
import { getNodes } from "../config/node-map";
import { ActionType, INode, INodeProgress, MyCreateSlice, NodeLevel } from "../shared/types";
import { ActionsSlice } from "./actions";
import { enumFromKey } from "../shared/utils";

export interface NodesSlice {
  nodes: Record<NodeLevel, Record<string, INode>>,
  nodeProgress?: INodeProgress,

  queueMining: (nodeId: string, level: NodeLevel) => void,
  startNodeAction: (combinedNodeId: string) => void,
  completeNode: (combinedNodeId: string) => void,
  isConnectedCompleted: (nodeId: string, level: NodeLevel) => boolean,
}

const defaultNodes = {
  [NodeLevel.Internet]: getNodes(NodeLevel.Internet),
  [NodeLevel.Infranet]: getNodes(NodeLevel.Infranet),
  [NodeLevel.Computer]: getNodes(NodeLevel.Computer),
};

const nodeActionIdMapping: Record<string, [NodeLevel, string]> = {};
Object.entries(defaultNodes).map(([level, nodes]) => {
  Object.keys(nodes).forEach((nodeId) => {
    nodeActionIdMapping[level + '-' + nodeId] = [enumFromKey(NodeLevel, level)!, nodeId];
  });
});

const createNodesSlice: MyCreateSlice<NodesSlice, [() => ActionsSlice]>
= (set, get, actions) => {
  return {
    nodes: defaultNodes,
    nodeProgress: undefined,

    queueMining: (nodeId, level) => {
      const node = get().nodes[level][nodeId];
      actions().queueAction({
        name: "Node - " + node.name,
        type: ActionType.Node,
        requiredSkill: node.requiredSkill,
        current: 0,
        requirement: node.requirement,
        relatedId: level + '-' + nodeId,
      })
    },

    completeNode: (nodeCombinedId: string) => {
      const newNodes = cloneDeep(get().nodes);
      const [level, nodeId] = nodeActionIdMapping[nodeCombinedId];
      _.set(newNodes, `${level}.${nodeId}.isComplete`, true);

      set({ nodes: newNodes, nodeProgress: undefined });
    },

    startNodeAction: (nodeCombinedId: string) => {
      const [level, nodeId] = nodeActionIdMapping[nodeCombinedId];
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
    }
  };
};

export default createNodesSlice;