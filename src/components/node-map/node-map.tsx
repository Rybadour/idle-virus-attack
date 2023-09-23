import { pick } from "lodash";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { shallow } from "zustand/shallow";

import { INode, NodeType } from "../../shared/types";
import { lerpLineSegment, lineSegmentBetweenCircles } from "../../shared/utils";
import useStore from "../../store";
import { NODE_SIZE, Node } from "./node";

interface Coords {
  x: number;
  y: number;
}

export default function NodeMap() {
  const nodes = useStore(s => s.nodes);
  const actions = useStore(s => pick(s.actions, ['queuedActions']), shallow);
  const [panOffset, setPanOffset] = useState<Coords>({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);

  const nodeAction = actions.queuedActions[0];

  const moveMouse = useCallback((evt: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (isDragging) {
      setPanOffset({ x: evt.movementX + panOffset.x, y: evt.movementY + panOffset.y });
    }
  }, [isDragging, panOffset, setPanOffset]);
  const clickNode = useCallback((node: INode) => {
    if (node.isComplete && node.type === NodeType.Subnet) {
      nodes.switchToSubnet(node.subnet);
    } else {
      //if (nodes.isConnectedCompleted(nodeId, NodeLevel.Internet)) {
        nodes.queueMining(node.id, nodes.currentMap);
      //}
    }
  }, [nodes])

  const nodeMap = nodes.nodes[nodes.currentMap];

  return <NodesContainer
    onMouseDown={() => setIsDragging(true)}
    onMouseUp={() => setIsDragging(false)}
    onMouseMove={(evt) => moveMouse(evt)}
  >
    <g transform={`translate(${panOffset.x} ${panOffset.y})`}>

    {Object.values(nodeMap).map(node =>
      node.connections.map(otherId => {
        const other = nodeMap[otherId];
        let otherLine;
        if (nodes.nodeProgress && nodes.nodeProgress.node.id === otherId) {
          const progress = nodeAction.current / nodeAction.requirement;
          const progressLine = lineSegmentBetweenCircles(node, other, NODE_SIZE/2);
          const progressPoint = lerpLineSegment(progressLine[0], progressLine[1], progress);
          otherLine = <line
            key={node.id + '-' + otherId + '-progress'} x1={progressLine[0].x} y1={progressLine[0].y} x2={progressPoint.x} y2={progressPoint.y}
            stroke="white" strokeWidth={3}
          />;
        }
        return <>
          <NodeConnection
            key={node.id + '-' + otherId} x1={node.x} y1={node.y} x2={other.x} y2={other.y}
            isComplete={other.isComplete}
          />
          {otherLine}
        </>;
      })
    )}

    {Object.values(nodeMap).map(node =>
      <Node
        key={node.id} node={node}
        onClick={() => clickNode(node)}
      ></Node>
    )}
    </g>
  </NodesContainer>;
}

const NodesContainer = styled.svg`
  width: 100%;
  height: 100%;
  border: 1px solid #aaa;
  border-radius: 15px;
  background: black;
`;

const NodeConnection = styled.line<{isComplete: boolean}>`
  stroke: ${p => p.isComplete ? 'white': 'grey'};
  stroke-width: 3px;
`;