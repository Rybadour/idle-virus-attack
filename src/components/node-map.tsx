import { pick } from "lodash";
import { useCallback, useState } from "react";
import styled from "styled-components";

import { INode, NodeLevel } from "../shared/types";
import { lerpLineSegment } from "../shared/utils";
import useStore from "../store";
import { NODE_STRENGTH } from "../store/nodes";

const NODE_SIZE = 30;

interface Coords {
  x: number;
  y: number;
}

export default function NodeMap(props: {nodes: Record<string, INode>}) {
  const nodes = useStore(s => pick(s.nodes, ['startMining', 'isConnectedCompleted', 'nodeProgress']));
  const [panOffset, setPanOffset] = useState<Coords>({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);

  const moveMouse = useCallback((evt: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (isDragging) {
      setPanOffset({ x: evt.movementX + panOffset.x, y: evt.movementY + panOffset.y });
    }
  }, [isDragging, panOffset, setPanOffset]);
  const mineNode = useCallback((nodeId: string) => {
    if (nodes.isConnectedCompleted(nodeId, NodeLevel.Internet)) {
      nodes.startMining(nodeId, NodeLevel.Internet);
    }
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
        if (nodes.nodeProgress && nodes.nodeProgress.nodeId === otherId) {
          const progress = nodes.nodeProgress.minedAmount / NODE_STRENGTH;
          const progressPoint = lerpLineSegment(node, other, progress);
          otherLine = <line
            key={node.id + '-' + otherId + '-progress'} x1={node.x} y1={node.y} x2={progressPoint.x} y2={progressPoint.y}
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
      <Node
        key={node.id} cx={node.x} cy={node.y} r={NODE_SIZE/2}
        isComplete={node.isComplete}
        onClick={() => mineNode(node.id)}
      />
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