import internetNodeMap from '../../configs/VirusNodeDesign/simplified/Level_0/data.json';
import { INode, NodeLevel } from '../shared/types';

interface INodeMapDesign {
  entities: {
    HackingNode: {
      iid: string,
      x: number,
      y: number,
      customFields: {
        connectedNodes: {
          entityIid: string,
        }[]
      }
    }[]
  }
}

export function getNodes(level: NodeLevel) {
  const nodes: Record<string, INode> = {};

  let nodeMap: INodeMapDesign;
  switch (level) {
    case NodeLevel.Internet:
      nodeMap = internetNodeMap;
      break;
    case NodeLevel.Infranet:
      nodeMap = internetNodeMap;
      break;
    case NodeLevel.Computer:
      nodeMap = internetNodeMap;
      break;
    default:
      const stop: never = level;
      throw new Error(stop);
  }

  nodeMap.entities.HackingNode.forEach(node => {
    nodes[node.iid] = {
      id: node.iid,
      x: node.x,
      y: node.y,
      connections: node.customFields.connectedNodes.map(connection => 
        connection.entityIid
      ),
      isComplete: false
    }
  })

  return nodes;
}