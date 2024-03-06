import { StoreApi } from "zustand";
import { ProgramId as ProgramId } from "../config/programs";

export interface INode {
  id: string,
  x: number,
  y: number,
  name: string,
  type: NodeType,
  requirement: number,
  requiredSkill: SkillType,
  icon: string,
  connections: string[],
  isStart: boolean,
  isQueueable: boolean,
  isComplete: boolean,
  subnet?: NodeLevel,
  nodeRewardProgram?: ProgramId,
  idName?: string,
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

export enum ActionType {
  Program = 'Program',
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
    type: ActionType.Program,
    id: ProgramId,
  }
}

export type Lens<T> = [set: StoreApi<T>['setState'], get: StoreApi<T>['getState']];

export type MyCreateSlice<T, A extends (() => any)[]> =
  (set: StoreApi<T>['setState'], get: StoreApi<T>['getState'], ...args: A) => T