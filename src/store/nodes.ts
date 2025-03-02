import _, { cloneDeep } from "lodash";
import { getNodes } from "../config/node-map";
import { ActionType, IActionCompletion, INode, INodeProgress, MyCreateSlice, NodeLevel, NodePathId, NodeType, SkillType } from "../shared/types";
import { ActionsSlice } from "./actions";
import { ProgramsSlice } from "./programs";
import { globals } from "../globals";

export interface NodesSlice {
  nodes: Record<NodeLevel, Record<string, INode>>,
  currentMap: NodeLevel,
  nodeProgress?: INodeProgress,

  queueMining: (nodeId: string, level: NodeLevel) => void,
  startNodeAction: (nodePath: NodePathId) => void,
  discoverConnectedNode: (nodePath: NodePathId) => IActionCompletion,
  unlockNode: (nodePath: NodePathId) => void,
  completeNode: (nodePath: NodePathId) => void,
  isConnectedCompleted: (nodeId: string, level: NodeLevel) => boolean,
  switchToSubnet: (subnet?: NodeLevel) => void,
  reset: () => void,
  getNode: (nodePath: NodePathId) => INode,
  getNodeByIdName: (idName: string) => INode | undefined,
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

const createNodesSlice: MyCreateSlice<NodesSlice, [() => ActionsSlice, () => ProgramsSlice]>
= (set, get, actions, programs) => {

  return {
    nodes: {
      [NodeLevel.Internet]: preprocessLevel(NodeLevel.Internet),
      [NodeLevel.HighSchool]: preprocessLevel(NodeLevel.HighSchool),
    },
    currentMap: NodeLevel.Internet,
    nodeProgress: undefined,

    queueMining: (nodeId, levelId) => {
      const level = get().nodes[levelId];
      const node = level[nodeId];
      
      if (!node.isUnlocked) {
        actions().queueAction({
          name: "Unlocking Node: " + node.name,
          typeId: {type: ActionType.UnlockNode, id: [levelId, nodeId]},
          requiredSkill: node.requiredSkill,
          current: 0,
          requirement: node.requirement,
        });
      } else if (!node.routesDiscovered) {
        actions().queueAction({
          name: "Discovering routes connected to Node: " + node.name,
          typeId: {type: ActionType.DiscoverRoutes, id: [levelId, nodeId]},
          requiredSkill: SkillType.Mapping,
          current: 0,
          requirement: globals.DISCOVER_REQUIREMENT,
        });
      }
    },

    discoverConnectedNode: ([levelId, nodeId]) => {
      const newNodes = cloneDeep(get().nodes);
      const level = newNodes[levelId];
      const node = level[nodeId];

      const undiscoveredConnected = node.connections.filter((connecting) => !level[connecting].isDiscovered);
      if (undiscoveredConnected.length >= 0) {
        node.numDiscovered++;
        level[undiscoveredConnected[0]].isDiscovered = true;
        set({ nodes: newNodes });
      } else {
        return { stopRepeat: true };
      }

      const unscannedConnected = node.connections.filter((connecting) => !level[connecting].isScanned);
      return {
        stopRepeat: node.numDiscovered >= unscannedConnected.length,
      }
    },

    unlockNode: ([level, nodeId]) => {
      const newNodes = cloneDeep(get().nodes);
      const node = newNodes[level][nodeId];
      node.isUnlocked = true;
      if (node.type === NodeType.Subnet) {
        node.routesDiscovered = true;
        node.routesScanned = true;
        node.isComplete = true;
      }
      set({ nodes: newNodes, nodeProgress: undefined });
    },

    completeNode: ([level, nodeId]) => {
      const newNodes = cloneDeep(get().nodes);
      const node = newNodes[level][nodeId];
      node.isComplete = true;
      node.isQueueable = false;

      markConnectionsAsQueueable(newNodes[level], nodeId);
      set({ nodes: newNodes, nodeProgress: undefined });

      if (node.nodeRewardProgram) {
        programs().rewardProgram(node.nodeRewardProgram);
      }
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
    },

    getNode: (nodePath: NodePathId) => {
      return get().nodes[nodePath[0]][nodePath[1]];
    },

    getNodeByIdName: (idName: string) => {
      const nodes = get().nodes;
      for (const nodeLevel of Object.values(nodes)) {
        for (const node of Object.values(nodeLevel)) {
          if (node.idName === idName) {
            return node;
          }
        }
      }

      return;
    }
  };
};

export default createNodesSlice;