import { useCallback } from "react";
import useStore from "../store"
import styled from "styled-components";
import { autoFormatNumber } from "../shared/utils";

export function ResetPage() {
  const stats = useStore(s => s.stats);
  const scenes = useStore(s => s.scenes);

  const onRestart = useCallback(() => {
    scenes.restart();
  }, [scenes]);

  return <Page>
    <Header>You Been Caught!</Header>

    <p>You keep some permanent experience with your skills and you gain {autoFormatNumber(stats.lastAddedMaxProtection)} max protection forever!</p>

    <RestartButton type="button" onClick={onRestart}>Restart</RestartButton>
  </Page>;
}

const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
`;

const Header = styled.h3`
`;

const RestartButton = styled.button`
  padding: 20px 40px;
  font-size: 22px;
`;