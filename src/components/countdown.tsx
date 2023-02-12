import styled from "styled-components";

export default function CountdownTimer() {
  return <CountDownContainer>
    <Time>Time Until Antivirus Catches You: 1:23 minutes</Time>
  </CountDownContainer>
}

const CountDownContainer = styled.div`
  width: 100%;
  height: 40px;
  background-color: white;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const Time = styled.strong`
  font-size: 20px;
`;