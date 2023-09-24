import styled from "styled-components";
import useStore from "../store";
import programsConfig from "../config/programs";
import { useCallback } from "react";
import { ActionType, ProgramConfig } from "../shared/types";

export default function Programs() {
  const actions = useStore(s => s.actions);

  const queueProgram = useCallback((con: ProgramConfig) => {
    actions.queueAction({
      typeId: {type: ActionType.Program, id: con.id},
      current: 0,
      ...con,
      name: 'Program - ' + con.name,
    });
  }, [actions]);

  return <ProgramsContainer>
    <h2>Programs</h2>
    <ProgramList>
      {Object.values(programsConfig).map((con) => 
        <Program key={con.id} onClick={() => queueProgram(con)}>
          <span>{con.name}</span>
          <span>{con.description}</span>
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