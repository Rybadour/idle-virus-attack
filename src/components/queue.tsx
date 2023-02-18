import { pick } from "lodash";
import styled from "styled-components";
import useStore from "../store";

export default function Queue() {
  const actions = useStore(s => pick(s.actions, ['queuedActions']))

  return <QueueContainer>
    {actions.queuedActions.map(action =>
      <Action>
        <strong>{action.name}</strong>
        <strong>Skill: {action.requiredSkill}</strong>
        <progress value={action.current} max={action.requirement}></progress>
      </Action>
    )}
  </QueueContainer>
}

const QueueContainer = styled.div`
  width: 100%;
  min-width: 200px;
  max-width: 300px;
  background-color: grey;
  border-radius: 10px;
  padding: 10px;
`;

const Action = styled.div`
  width: 100%;
  display: flex;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
`;