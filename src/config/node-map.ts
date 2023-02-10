import nodeMapDesign from '../../configs/VirusNodeDesign/simplified/Level_0/data.json';
import { INode } from '../shared/types';

let nodes: Record<string, INode>;
export function getNodes() {
  if (!nodes) {
    nodes = {};
    nodeMapDesign.entities.HackingNode.forEach(node => {
      nodes[node.iid] = {
        id: node.iid,
        x: node.x,
        y: node.y,
        connections: node.customFields.connectedNodes.map(connection => 
          connection.entityIid
        )
      }
    })
  }

  return nodes;
}