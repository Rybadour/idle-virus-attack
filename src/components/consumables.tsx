import { pick } from "lodash";
import styled from "styled-components";
import useStore from "../store";
import consumablesConfig from "../config/consumables";
import { useCallback } from "react";
import { ActionType, ConsumableConfig } from "../shared/types";

export default function Consumables() {
  const actions = useStore(s => s.actions);

  const queueConsumable = useCallback((con: ConsumableConfig) => {
    actions.queueAction({
      type: ActionType.Consumable,
      current: 0,
      ...con,
      name: 'Consumable - ' + con.name,
    });
  }, [actions]);

  return <ConsumablesContainer>
    <h2>Consumables</h2>
    <ConsumableList>
      {Object.values(consumablesConfig).map((con) => 
        <Consumable onClick={() => queueConsumable(con)}>
          <span>{con.name}</span>
          <span>{con.description}</span>
        </Consumable>
      )}
    </ConsumableList>
  </ConsumablesContainer>
}

const ConsumablesContainer = styled.div`
  width: 260px;
  color: white;
`;

const ConsumableList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Consumable = styled.button`
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