import { pick } from "lodash";
import styled from "styled-components";
import useStore from "../store";
import { autoFormatNumber } from "../shared/utils";

export default function CountdownTimer() {
  const stats = useStore(s => pick(s.stats, ['protection', 'maxProtection', 'antiVirusStrength']))

  const progress = stats.protection / stats.maxProtection * 100;
  const avStrenthText = "Anti-Virus Strength is " + autoFormatNumber(stats.antiVirusStrength);
  return <CountDownContainer>
    <StrengthText color="black">{avStrenthText}</StrengthText>
    <CountDownProgress style={{width: progress + '%'}}>
      <StrengthText color="white">{avStrenthText}</StrengthText>
    </CountDownProgress>
  </CountDownContainer>
}

const CountDownContainer = styled.div`
  width: 100%;
  height: 40px;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  position: relative;
`;

const CountDownProgress = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  background-color: red;
  overflow: hidden;
`;

const StrengthText = styled.div<{color: string}>`
  position: absolute;
  height: 100%;
  margin-left: 10px;
  font-size: 20px;
  overflow: hidden;
  text-wrap: nowrap;
  color: ${p => p.color};
  display: flex;
  align-items: center;
`;

const Time = styled.strong`
  font-size: 20px;
`;