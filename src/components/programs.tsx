import styled from "styled-components";
import useStore from "../store";
import { useCallback } from "react";
import { ActionType } from "../shared/types";
import { ProgramConfig } from "../config/programs";
import { StatsSlice } from "../store/stats";
import { autoFormatNumber } from "../shared/utils";

export default function Programs() {
  const stats = useStore(s => s.stats);
  const programs = useStore(s => s.programs);
  const actions = useStore(s => s.actions);
  const nodes = useStore(s => s.nodes);

  function getBehaviourDescription(program: ProgramConfig, stats: StatsSlice) {
    const duration = (program.requirement / stats.getSkill(program.requiredSkill));
    if (program.protectionProvided) {
      if (duration > 1) {
        return `Provides ${autoFormatNumber(program.protectionProvided)} protection after ${autoFormatNumber(duration)}s.`;
      } else {
        const speed = program.protectionProvided / duration;
        return `Provides ${autoFormatNumber(speed)} protection/s`
      }
    } else if (program.maxProtectionMultiplier) {
      const multiPercent = (program.maxProtectionMultiplier - 1) * 100;
      return `Increases max protection by ${autoFormatNumber(multiPercent)}% after ${autoFormatNumber(duration)}s.`;
    } else if (program.antiVirusReduction) {
      const multiPercent = (1/program.antiVirusReduction) * 100;
      return `Reduce anti-virus strength by ${autoFormatNumber(multiPercent)}% after ${autoFormatNumber(duration)}s.`;
    } else if (program.nodeSpeedUp) {
      const node = nodes.getNodeByIdName(program.nodeSpeedUp.node);
      if (node) {
        return `Reduce the cost of hacking the '${node.name}' node by ${program.nodeSpeedUp.speedUp}x.`;
      }
    }

    return '';
  }

  const queueProgram = useCallback((prog: ProgramConfig) => {
    actions.queueAction({
      typeId: {type: ActionType.Program, id: prog.id},
      current: 0,
      ...prog,
      name: 'Program - ' + prog.name,
    });
  }, [actions]);

  return <ProgramsContainer>
    <h2>Programs</h2>
    <ProgramList>
      {Object.values(programs.programs).filter(p => p.isEnabled).map((prog) => 
        <Program key={prog.id} onClick={() => queueProgram(prog)}>
          <strong>{prog.name}</strong>
          <div>{getBehaviourDescription(prog, stats)}</div>
        </Program>
      )}
    </ProgramList>
  </ProgramsContainer>
}


const ProgramsContainer = styled.div`
  width: 260px;
  color: white;
`;

const ProgramList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Program = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background-color: white;
  border-radius: 5px;
  color: black;
  padding: 8px;
`;