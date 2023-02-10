import { useCallback, useState } from "react";
import styled from "styled-components";

const NODE_SIZE = 30;

interface INode {
  x: number;
  y: number;
}

const nodes: INode[] = [
  {x: 40, y: 50},
  {x: 40, y: 100},
  {x: 150, y: 100}
];

interface Coords {
  x: number;
  y: number;
}

export default function Viruses() {
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
    
    <line x1={nodes[0].x} y1={nodes[0].y} x2={nodes[1].x} y2={nodes[1].y} stroke="white" strokeWidth={3} />
    <line x1={nodes[1].x} y1={nodes[1].y} x2={nodes[2].x} y2={nodes[2].y} stroke="white" strokeWidth={3} />

    {nodes.map(node =>
      <Node cx={node.x} cy={node.y} r={NODE_SIZE/2} />
    )}
    </g>
  </NodesContainer>;
}

const NodesContainer = styled.svg`
  width: 100%;
  height: 100%;
  margin: 30px;
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
