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
  reset: () => void,
}

function preprocessLevel(level: NodeLevel) {
  const nodes = getNodes(level);
  const startNode = Object.entries(nodes).find(([_, node]) => node.isStart);
  if (!startNode) throw "Could not find a start node for " + level;

  markConnectionsAsQueueable(nodes, startNode[0]);
  return nodes;
}

function markConnectionsAsQueueable(nodes: Record<string, INode>, nodeId: string) {
  if (!nodes[nodeId]) return;

  nodes[nodeId].isQueueable = false;
  nodes[nodeId].connections.forEach((connecting) => {
    if (nodes[connecting] && !nodes[connecting].isComplete) {
      nodes[connecting].isQueueable = true;
    }
  });
}

const createNodesSlice: MyCreateSlice<NodesSlice, [() => ActionsSlice]>
= (set, get, actions) => {

  return {
    nodes: {
      [NodeLevel.Internet]: preprocessLevel(NodeLevel.Internet),
      [NodeLevel.HighSchool]: preprocessLevel(NodeLevel.HighSchool),
    },
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
      });

      const newNodes = cloneDeep(get().nodes);
      markConnectionsAsQueueable(newNodes[level], nodeId);
      set({ nodes: newNodes });
    },

    completeNode: ([level, nodeId]) => {
      const newNodes = cloneDeep(get().nodes);
      newNodes[level][nodeId].isComplete = true;
      newNodes[level][nodeId].isQueueable = false;

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

    reset: () => {
      set({
        currentMap: NodeLevel.Internet,
        nodes: {
          [NodeLevel.Internet]: preprocessLevel(NodeLevel.Internet),
          [NodeLevel.HighSchool]: preprocessLevel(NodeLevel.HighSchool),
        },
        nodeProgress: undefined,
      })
    }
  };
};

export default createNodesSlice;