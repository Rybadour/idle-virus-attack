import styled, { css } from "styled-components";

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { INode } from "../../shared/types";

export const NODE_SIZE = 30;

export function Node(props: {node: INode, isTarget: boolean, onClick: () => void}) {
  return <>
    <Tooltip>
      <TooltipTrigger asChild>
        <g>
          <NodeCircle
            onClick={props.onClick}
            cx={props.node.x} cy={props.node.y} r={NODE_SIZE/2}
            isComplete={props.node.isComplete}
            isTarget={props.isTarget}
          />
          <NodeIcon x={props.node.x} y={props.node.y} icon={props.node.icon}></NodeIcon>
        </g>
      </TooltipTrigger>
      <TooltipContent>
        <TooltipContainer>
          <TooltipTitle>{props.node.name}</TooltipTitle>
          <TooltipStrength>Strength: {props.node.requirement}</TooltipStrength>
        </TooltipContainer>
      </TooltipContent>
    </Tooltip>
  </>;
}

const NodeCircle = styled.circle<{isComplete: boolean, isTarget: boolean}>`
  fill: ${props => props.isComplete ? '#5B8FB9;' : '#777'};

  ${p => p.isTarget && css`
    stroke: white;
    stroke-width: 2px;
    stroke-dasharray: 7 3;
  `}

  &:hover {
    filter: brightness(0.9);
    stroke: white;
    stroke-width: 2px;
  }
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

const TooltipContainer = styled.div`
  background-color: #222;
  border-radius: 5px;
  padding: 10px;
  color: white;
  z-index: 10;
`;

const TooltipTitle = styled.strong`
`;

const TooltipStrength = styled.div`

`;