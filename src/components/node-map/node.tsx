import styled, { css } from "styled-components";

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { INode } from "../../shared/types";
import { NodeFeatureIcon } from "./node-feature-icon";

export const NODE_SIZE = 30;
const ICON_SIZE = 18;

export function Node(props: {node: INode, isTarget: boolean, onClick: () => void}) {
  return <>
    <Tooltip>
      <TooltipTrigger asChild>
        <svg x={props.node.x} y={props.node.y} style={{overflow: 'visible'}}>
          <NodeCircle
            onClick={props.onClick}
            r={NODE_SIZE/2}
            isComplete={props.node.isComplete}
            isTarget={props.isTarget}
          />
          <image
            x={-ICON_SIZE/2}
            y={-ICON_SIZE/2}
            width={ICON_SIZE}
            height={ICON_SIZE}
            href={`icons/${props.node.icon}.png`}
            style={{pointerEvents: "none"}}
          />
        </svg>
      </TooltipTrigger>
      <TooltipContent>
        <TooltipContainer>
          <TooltipTitle>{props.node.name}</TooltipTitle>
          <TooltipStrength>Strength: {props.node.requirement}</TooltipStrength>
        </TooltipContainer>
      </TooltipContent>
    </Tooltip>
    {props.node.subnet &&
      <NodeFeatureIcon
        node={props.node}
        icon="exit-door"
        description="Contains Subnet. Click node to open subnet."
      />
    }
    {props.node.nodeRewardProgram &&
      <NodeFeatureIcon
        node={props.node}
        icon="computing"
        description={"Awards the " + props.node.nodeRewardProgram + " program on completion."}
      />
    }
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