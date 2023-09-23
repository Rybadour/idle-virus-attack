import { pick } from "lodash";
import { useCallback, useState } from "react";
import styled from "styled-components";

import { INode, NodeLevel } from "../shared/types";
import { lerpLineSegment, lineSegmentBetweenCircles } from "../shared/utils";
import useStore from "../store";
import { shallow } from "zustand/shallow";
import Icon from "../shared/components/icon";

const NODE_SIZE = 30;

interface Coords {
  x: number;
  y: number;
}

export default function NodeMap(props: {nodes: Record<string, INode>}) {
  const nodes = useStore(s => pick(s.nodes, ['queueMining', 'isConnectedCompleted', 'nodeProgress']), shallow);
  const actions = useStore(s => pick(s.actions, ['queuedActions']), shallow);
  const [panOffset, setPanOffset] = useState<Coords>({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);

  const nodeAction = actions.queuedActions[0];

  const moveMouse = useCallback((evt: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (isDragging) {
      setPanOffset({ x: evt.movementX + panOffset.x, y: evt.movementY + panOffset.y });
    }
  }, [isDragging, panOffset, setPanOffset]);
  const mineNode = useCallback((nodeId: string) => {
    //if (nodes.isConnectedCompleted(nodeId, NodeLevel.Internet)) {
      nodes.queueMining(nodeId, NodeLevel.Internet);
    //}
  }, [nodes])

  return <NodesContainer
    onMouseDown={() => setIsDragging(true)}
    onMouseUp={() => setIsDragging(false)}
    onMouseMove={(evt) => moveMouse(evt)}
  >
    <g transform={`translate(${panOffset.x} ${panOffset.y})`}>

    {Object.values(props.nodes).map(node =>
      node.connections.map(otherId => {
        const other = props.nodes[otherId];
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

    {Object.values(props.nodes).map(node =>
      <>
        <Node
          key={node.id} cx={node.x} cy={node.y} r={NODE_SIZE/2}
          isComplete={node.isComplete}
          onClick={() => mineNode(node.id)}
        ></Node>
        <NodeIcon x={node.x} y={node.y} icon={node.icon}></NodeIcon>
      </>
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

const Node = styled.circle<{isComplete: boolean}>`
  fill: ${props => props.isComplete ? '#5B8FB9;' : '#777'};

  &:hover {
    filter: brightness(0.9);
    stroke: white;
    stroke-width: 2px;
  }
`;

const NodeConnection = styled.line<{isComplete: boolean}>`
  stroke: ${p => p.isComplete ? 'white': 'grey'};
  stroke-width: 3px;
`;

function NodeIcon(props: {x: number, y: number, icon: string}) {
  const iconSize = 18;
  return <image
    x={props.x - iconSize/2}
    y={props.y - iconSize/2}
    width={iconSize}
    height={iconSize}
    href={`icons/${props.icon}.png`}
    style={{pointerEvents: "none"}}
  />;
}