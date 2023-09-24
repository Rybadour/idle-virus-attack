import { useCallback } from "react";
import useStore from "../store"
import styled from "styled-components";

export function ResetPage() {
  const scenes = useStore(s => s.scenes);

  const onRestart = useCallback(() => {
    scenes.restart();
  }, [scenes]);

  return <div>
    <Header>You Been Caught!</Header>

    <button type="button" onClick={onRestart}>Restart</button>
  </div>
}

const Header = styled.h3`
  color: white;
`;