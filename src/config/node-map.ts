import { first } from 'lodash';
import internetNodeMap from '../../configs/VirusNodeDesign/simplified/Internet/data.json';
import highschoolNodeMap from '../../configs/VirusNodeDesign/simplified/HighSchool/data.json';
import { INode, NodeLevel, NodeType, SkillType } from '../shared/types';
import { enumFromKey } from '../shared/utils';
import programsWithIds, { ProgramId } from './programs';

interface INodeMapDesign {
  entities: {
    HackingNode: {
      iid: string,
      x: number,
      y: number,
      customFields: {
        name: string,
        requiredSkill: string,
        requirement: number,
        icon: string,
        type: string,
        subnet: string | null,
        nodeRewardProgram: string | null,
        idName: string | null,
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
      name: node.customFields.name,
      type: enumFromKey(NodeType, node.customFields.type)!,
      requiredSkill: enumFromKey(SkillType, node.customFields.requiredSkill)!,
      requirement: node.customFields.requirement,
      icon: node.customFields.icon.toLowerCase().replace('_', '-'),
      connections: node.customFields.connectedNodes.map(connection => 
        connection.entityIid
      ),
      isStart: node.iid === startId,
      isQueueable: false,
      isComplete: node.iid == startId,
      subnet: enumFromKey(NodeLevel, node.customFields.subnet ?? ''),
      nodeRewardProgram: mapStringToProgramId(node.customFields.nodeRewardProgram),
      idName: node.customFields.idName,
    };
  })

  return nodes;
}

function mapStringToProgramId(strId: string | null) {
  if (!strId) return;

  if (Object.keys(programsWithIds).includes(strId)) {
    return strId as ProgramId;
  } else {
    throw `nodeRewardProgram "${strId}" is not a known program.`;
  }
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
    case NodeLevel.HighSchool:
      nodeMap = highschoolNodeMap;
      break;
    default:
      const stop: never = level;
      throw new Error(stop);
  }
  return nodeMap;
}