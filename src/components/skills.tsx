
import { pick } from "lodash";
import styled from "styled-components";
import { formatNumber } from "../shared/utils";
import useStore from "../store";

export default function SkillsContainer() {
  const stats = useStore(s => pick(s.stats, ['hackingSkill']));

  return <Skills>
    <Skill>
      <span>Hacking</span>
      <span>{formatNumber(stats.hackingSkill, 0, 0)}</span>
    </Skill>
  </Skills>
}

const Skills = styled.div`
  width: 100%;
  color: white;
`;

const Skill = styled.div`
  width: 120px;
  height: 30px;
`;