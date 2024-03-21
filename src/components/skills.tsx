
import { pick } from "lodash";
import styled from "styled-components";
import { enumFromKey, formatNumber } from "../shared/utils";
import useStore from "../store";
import { SkillType } from "../shared/types";
import { ProgressBar } from "../shared/components/progress-bar";

export default function Skills() {
  const stats = useStore(s => s.stats);

  return <SkillsContainer>
    <h2>Skills</h2>
    <SkillList>
      {Object.keys(stats.skills).map((s) => {
        const skill = enumFromKey(SkillType, s)!;
        const perma = stats.permanentSkills[skill];
        return <Skill key={skill}>
          <SkillStats>
            <span>{skill}</span>
            <span>{formatNumber(stats.getSkill(skill), 0, 0)} ({Math.floor(perma)})</span>
          </SkillStats>
          <div>
            <ProgressBar progress={perma - Math.floor(perma)} height={5} color={"#5B8FB9"} noBorder />
          </div>
        </Skill>
      })}
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
  background-color: white;
  border-radius: 5px;
  color: black;
  overflow: hidden;
`;

const SkillStats = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 8px 8px;
`;