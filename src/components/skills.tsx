
import { pick } from "lodash";
import styled from "styled-components";
import { formatNumber } from "../shared/utils";
import useStore from "../store";

export default function Skills() {
  const stats = useStore(s => pick(s.stats, ['skills']));

  return <SkillsContainer>
    <h2>Skills</h2>
    <SkillList>
      {Object.entries(stats.skills).map(([skill, amount]) => 
        <Skill key={skill}>
          <span>{skill}</span>
          <span>{formatNumber(amount, 0, 0)}</span>
        </Skill>
      )}
    </SkillList>
  </SkillsContainer>
}

const SkillsContainer = styled.div`
  width: 260px;
  color: white;
`;

const SkillList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Skill = styled.div`
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background-color: white;
  border-radius: 5px;
  color: black;
  padding: 8px;
`;