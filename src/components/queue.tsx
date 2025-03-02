import { pick } from "lodash";
import styled from "styled-components";
import useStore from "../store";
import { shallow } from "zustand/shallow";

export default function Queue() {
  const actions = useStore(s => pick(s.actions, ['queuedActions']), shallow)

  return <QueueContainer>
    <Title>Queue</Title>
    <QueueList>
    {actions.queuedActions.map(action =>
      <Action>
        <div>{action.name}</div>
        <strong>Skill: {action.requiredSkill}</strong>
        <progress value={action.current} max={action.requirement}></progress>
      </Action>
    )}
    </QueueList>
  </QueueContainer>
}

const Title = styled.h2`
  margin-top: 0;
  color: white;
`;

const QueueContainer = styled.div`
  width: 100%;
  min-width: 260px;
  max-width: 300px;
  background-color: grey;
  border-radius: 10px;
  padding: 10px;
`;

const QueueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Action = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
`;