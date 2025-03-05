import styled, { css } from "styled-components";

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { INode } from "../../shared/types";
import { NodeFeatureIcon } from "./node-feature-icon";

export const NODE_SIZE = 30;
const ICON_SIZE = 18;

export function Node(props: {node: INode, isTarget: boolean, onClick: () => void}) {
  const { node } = props;
  return <>
    <Tooltip>
      <TooltipTrigger asChild>
        <svg x={props.node.x} y={props.node.y} style={{overflow: 'visible'}}>
          <NodeCircle
            onClick={props.onClick}
            r={NODE_SIZE/2}
            isScanned={props.node.isScanned}
            isComplete={props.node.isComplete}
            isTarget={props.isTarget}
          />
          {node.isScanned ?
            <image
              x={-ICON_SIZE/2}
              y={-ICON_SIZE/2}
              width={ICON_SIZE}
              height={ICON_SIZE}
              href={`icons/${props.node.icon}.png`}
              style={{pointerEvents: "none"}}
            /> :
            <Unscanned x={-6} y={8}>?</Unscanned>
          }
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
        icon="disc"
        description={"Awards the " + props.node.nodeRewardProgram + " program on completion."}
      />
    }
  </>;
}

const NodeCircle = styled.circle<{isComplete: boolean, isScanned: boolean, isTarget: boolean}>`
  fill: ${p => p.isComplete ? '#5B8FB9;' : (p.isScanned ? '#777' : 'black')};

  ${p => p.isTarget && css`
    stroke: white;
    stroke-width: 2px;
    stroke-dasharray: 7 3;
  `}

  ${p => !p.isScanned && css`
    stroke: grey;
    stroke-width: 2px;
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

const Unscanned = styled.text`
  font: bold 20px sans-serif;
  fill: #fff;
  pointer-events: none;
`

const TooltipTitle = styled.strong`
`;

const TooltipStrength = styled.div`

`;