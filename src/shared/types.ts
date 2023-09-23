import { StoreApi } from "zustand";
import { ConsumableId } from "../config/consumables";

export interface INode {
  id: string;
  x: number;
  y: number;
  name: string;
  type: NodeType;
  requirement: number;
  requiredSkill: SkillType,
  icon: string;
  connections: string[],
  isComplete: boolean;
  subnet?: NodeLevel;
}

export type NodePathId = [NodeLevel, string];

export interface INodeProgress {
  node: INode;
  level: NodeLevel;
}

export enum NodeType {
  Subnet = "Subnet",
  Normal = "Normal",
}

export enum NodeLevel {
  Internet = 'Internet',
  HighSchool = 'Highschool',
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