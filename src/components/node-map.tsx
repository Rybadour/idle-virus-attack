import { useCallback, useState } from "react";
import styled from "styled-components";
import { INode } from "../shared/types";

const NODE_SIZE = 30;

interface Coords {
  x: number;
  y: number;
}

export default function NodeMap(props: {nodes: Record<string, INode>}) {
  const [panOffset, setPanOffset] = useState<Coords>({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);

  const moveMouse = useCallback((evt: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (isDragging) {
      setPanOffset({ x: evt.movementX + panOffset.x, y: evt.movementY + panOffset.y });
    }
  }, [isDragging, panOffset, setPanOffset]);

  return <NodesContainer
    onMouseDown={() => setIsDragging(true)}
    onMouseUp={() => setIsDragging(false)}
    onMouseMove={(evt) => moveMouse(evt)}
    >
    <g transform={`translate(${panOffset.x} ${panOffset.y})`}>

    {Object.values(props.nodes).map(node =>
      node.connections.map(otherId => {
        const other = props.nodes[otherId];
        return <NodeConnection key={node.id + '-' + otherId} x1={node.x} y1={node.y} x2={other.x} y2={other.y} />;
      })
    )}

    {Object.values(props.nodes).map(node =>
      <Node key={node.id} cx={node.x} cy={node.y} r={NODE_SIZE/2} />
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

const Node = styled.circle`
  fill: #5B8FB9;

  &:hover {
    filter: brightness(0.9);
    stroke: white;
    stroke-width: 2px;
  }
`;

const NodeConnection = styled.line`
  stroke: white;
  stroke-width: 3px;
`;