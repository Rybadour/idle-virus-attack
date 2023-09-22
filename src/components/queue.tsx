import { pick } from "lodash";
import styled from "styled-components";
import useStore from "../store";
import { shallow } from "zustand/shallow";

export default function Queue() {
  const actions = useStore(s => pick(s.actions, ['queuedActions']), shallow)

  return <QueueContainer>
    {actions.queuedActions.map(action =>
      <Action>
        <div>{action.name}</div>
        <strong>Skill: {action.requiredSkill}</strong>
        <progress value={action.current} max={action.requirement}></progress>
      </Action>
    )}
  </QueueContainer>
}

const QueueContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-width: 200px;
  max-width: 300px;
  background-color: grey;
  border-radius: 10px;
  padding: 10px;
`;

const Action = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
`;