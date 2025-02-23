import styled, { css } from "styled-components";

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { INode } from "../../shared/types";
import { NODE_SIZE } from "./node";

export const FEATURE_ICON_SIZE = 16;
const FEATURE_OFFSET = 8;

export function NodeFeatureIcon(props: {node: INode, icon: string, description: string}) {
  return <>
    <Tooltip placement="right">
      <TooltipTrigger asChild>
        <svg
          x={props.node.x + NODE_SIZE/2 + FEATURE_OFFSET}
          y={props.node.y + NODE_SIZE/2 + FEATURE_OFFSET}
          style={{overflow: 'visible'}}
        >
          <image
            x={-FEATURE_ICON_SIZE/2}
            y={-FEATURE_ICON_SIZE/2}
            width={FEATURE_ICON_SIZE}
            height={FEATURE_ICON_SIZE}
            href={`icons/${props.icon}.png`}
          />
        </svg>
      </TooltipTrigger>
      <TooltipContent>
        <TooltipContainer>
          <TooltipTitle>{props.description}</TooltipTitle>
        </TooltipContainer>
      </TooltipContent>
    </Tooltip>
  </>;
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