import { mapValues } from "lodash";
import { ConsumableConfig, SkillType } from "../shared/types";

const consumablesConfig = {
  decoys: {
    name: 'Decoy Executables',
    description: '',
    requirement: 100,
    requiredSkill: SkillType.Spoofing,
    protectionProvided: 10,
  }
} satisfies Record<string, Omit<ConsumableConfig, "id">>;;

export type ConsumableId = keyof typeof consumablesConfig;

const consumablesWithIds: Record<ConsumableId, ConsumableConfig> = mapValues(consumablesConfig, (consumable, key) => {
  const id = key as ConsumableId;

  return {
    ...consumable,
    id,
  }
});

export default consumablesWithIds;