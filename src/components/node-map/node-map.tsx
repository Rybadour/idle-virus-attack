import { pick } from "lodash";
import { useCallback, useState } from "react";
import styled, { css } from "styled-components";
import { shallow } from "zustand/shallow";

import { IAction, INode, INodeProgress, NodeLevel, NodeType } from "../../shared/types";
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
    } else if (!node.isComplete) {
      nodes.queueMining(node.id, nodes.currentMap);
    }
  }, [nodes]);
  const backToInternet = useCallback(() => {
    nodes.switchToSubnet(NodeLevel.Internet);
  }, [nodes]);

  const nodeMap = nodes.nodes[nodes.currentMap];
  const isViewingSubnet = nodes.currentMap !== NodeLevel.Internet;

  return <NodeMapPanel>
    <NodeNavigationList>
      <NodeNavItem clickable={isViewingSubnet} onClick={backToInternet}>Internet</NodeNavItem>
      {isViewingSubnet && <>
        <span>&gt;</span>
        <NodeNavItem clickable={false}>{nodes.currentMap}</NodeNavItem>
      </>}
    </NodeNavigationList>
    <NodesContainer
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseMove={(evt) => moveMouse(evt)}
    >
      <g transform={`translate(${panOffset.x} ${panOffset.y})`}>
      {Object.values(nodeMap)
        .filter(node => node.isUnlocked)
        .map(node => 
          <NodeConnections
            key={'connections_' + node.id}
            {...{nodeMap, node, nodeProgress: nodes.nodeProgress, nodeAction}}
          />
        )}

      {Object.values(nodeMap)
        .filter(node => node.isDiscovered)
        .map(node => 
          <Node
            key={node.id} node={node} isTarget={node.id === nodes.nodeProgress?.node.id}
            onClick={() => clickNode(node)}
          ></Node>
        )}
      </g>
    </NodesContainer>;
  </NodeMapPanel>;
}

interface INodeConnectionsProps {
  nodeMap: Record<string, INode>,
  node: INode,
  nodeProgress?: INodeProgress,
  nodeAction: IAction,
}
function NodeConnections({nodeMap, node, nodeProgress, nodeAction}: INodeConnectionsProps) {
  return <>
    {node.connections.map(otherId => {
      const other = nodeMap[otherId];
      // Don't render lines from target node
      if (nodeProgress && nodeProgress.node.id === node.id) return;
      // Don't render connection at all until it's discovered
      if (!other.isDiscovered) return;

      let progressLine;
      // Since connections are bidirectional only draw from complete nodes
      if (node.isUnlocked && nodeProgress && nodeProgress.node.id === otherId) {
        const progress = nodeAction.current / nodeAction.requirement;
        const edgeToEdge = lineSegmentBetweenCircles(node, other, NODE_SIZE/2);
        const progressPoint = lerpLineSegment(edgeToEdge[0], edgeToEdge[1], progress);
        progressLine = <line
          key={node.id + '-' + otherId + '-progress'} x1={edgeToEdge[0].x} y1={edgeToEdge[0].y} x2={progressPoint.x} y2={progressPoint.y}
          stroke="white" strokeWidth={3}
        />;
      }
      return <>
        <NodeConnection
          key={node.id + '-' + otherId} x1={node.x} y1={node.y} x2={other.x} y2={other.y}
          isComplete={node.isComplete && other.isUnlocked}
        />
        {progressLine}
      </>;
    })}
  </>;
}

const NodeMapPanel = styled.div`
  height: 100%;
`;

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

const NodeNavigationList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin: 10px 0 6px;
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const NodeNavItem = styled.div<{clickable: boolean}>`
  ${p => p.clickable && css`
    color: #DDD;
    cursor: pointer;
    &:hover {
      color: white;
    }
  `}
`;