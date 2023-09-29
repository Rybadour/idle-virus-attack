import { pick } from "lodash";
import styled from "styled-components";
import useStore from "../store";
import { autoFormatNumber, formatNumber } from "../shared/utils";

export default function CountdownTimer() {
  const stats = useStore(s => s.stats);

  const progress = stats.protection / stats.maxProtection * 100;
  const avStrenthText = "Anti-Virus Strength is " + autoFormatNumber(stats.antiVirusStrength);
  return <div>
    <CountDownContainer>
      <StrengthText color="black">{avStrenthText}</StrengthText>
      <CountDownProgress style={{width: progress + '%'}}>
        <StrengthText color="white">{avStrenthText}</StrengthText>
      </CountDownProgress>
    </CountDownContainer>
    <ProtectionText>{formatNumber(stats.protection, 0, 0)} / {formatNumber(stats.maxProtection, 0, 0)}</ProtectionText>
  </div>
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

const ProtectionText = styled.div`
  color: white;
  font-size: 20px;
  text-align: center;
`;