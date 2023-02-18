import { pick } from "lodash";
import styled from "styled-components";
import useStore from "../store";

export default function CountdownTimer() {
  const stats = useStore(s => pick(s.stats, ['protection', 'maxProtection', 'antiVirusStrength']))

  const progress = stats.protection / stats.maxProtection * 100;
  return <CountDownContainer>
    <CountDownProgress style={{width: progress + '%'}}></CountDownProgress>
    Some Text
  </CountDownContainer>
}

const CountDownContainer = styled.div`
  width: 100%;
  height: 40px;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
`;

const CountDownProgress = styled.div`
  display: flex;
  height: 100%;
  background-color: red;
`;

const Time = styled.strong`
  font-size: 20px;
`;