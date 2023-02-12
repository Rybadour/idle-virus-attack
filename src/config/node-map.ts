import { first } from 'lodash';
import internetNodeMap from '../../configs/VirusNodeDesign/simplified/Internet/data.json';
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
    }[],
    StartIndicator: {
      iid: string,
      x: number,
      y: number,
      customFields: {
        StartNode: {
          entityIid: string,
        }
      }
    }[]
  }
}


export function getNodes(level: NodeLevel) {
  const nodes: Record<string, INode> = {};

  const nodeMap = getMap(level);
  const startId = getStart(nodeMap);
  nodeMap.entities.HackingNode.forEach(node => {
    nodes[node.iid] = {
      id: node.iid,
      x: node.x,
      y: node.y,
      connections: node.customFields.connectedNodes.map(connection => 
        connection.entityIid
      ),
      isComplete: node.iid === startId,
    }
  })

  return nodes;
}

export function getStart(nodeMap: INodeMapDesign): string | undefined {
  return first(nodeMap.entities.StartIndicator)?.customFields.StartNode.entityIid;
}

export function getMap(level: NodeLevel) {
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
  return nodeMap;
}