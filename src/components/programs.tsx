import styled from "styled-components";
import useStore from "../store";
import { useCallback } from "react";
import { ActionType } from "../shared/types";
import { ProgramConfig } from "../config/programs";

export default function Programs() {
  const programs = useStore(s => s.programs);
  const actions = useStore(s => s.actions);

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
          <span>{prog.name}</span>
          <span>{prog.description}</span>
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