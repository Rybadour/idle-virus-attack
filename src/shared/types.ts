import { StoreApi } from "zustand";
import { ConsumableId } from "../config/consumables";

export interface INode {
  id: string;
  x: number;
  y: number;
  name: string;
  requirement: number;
  requiredSkill: SkillType,
  icon: string;
  connections: string[],
  isComplete: boolean;
}

export type NodePathId = [NodeLevel, string];

export interface INodeProgress {
  node: INode;
  level: NodeLevel;
}

export enum NodeLevel {
  Internet = 'internet',
  Infranet = 'infranet',
  Computer = 'computer',
}

export enum SkillType {
  Hacking = 'Hacking',
  Spoofing = 'Spoofing',
  Firewall = 'Firewall',
}

export interface ConsumableConfig {
  id: ConsumableId,
  name: string,
  description: string,
  requirement: number,
  requiredSkill: SkillType,
  protectionProvided: number,
}

export enum ActionType {
  Consumable = 'Consumable',
  Node = 'Node',
}

export interface IAction {
  name: string,
  requiredSkill: SkillType,
  requirement: number,
  current: number,
  typeId: {
    type: ActionType.Node,
    id: NodePathId,
  } | {
    type: ActionType.Consumable,
    id: ConsumableId,
  }
}

export type Lens<T> = [set: StoreApi<T>['setState'], get: StoreApi<T>['getState']];

export type MyCreateSlice<T, A extends (() => any)[]> =
  (set: StoreApi<T>['setState'], get: StoreApi<T>['getState'], ...args: A) => T