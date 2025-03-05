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
  isUnlocked: boolean,
  isDiscovered: boolean,
  isScanned: boolean,
  isQueueable: boolean,
  numDiscovered: number,
  routesDiscovered: boolean,
  routesScanned: boolean,
  isComplete: boolean,
  subnet?: NodeLevel,
  nodeRewardProgram?: ProgramId,
  idName: string | null,
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
  Mapping = 'Mapping',
}

export enum ActionType {
  Program = 'Program',
  UnlockNode = 'UnlockNode',
  DiscoverRoutes = 'DiscoverRoutes',
  ScanNode = 'ScanNode',
}

export interface IAction {
  name: string,
  requiredSkill: SkillType,
  requirement: number,
  current: number,
  typeId: {
    type: (ActionType.UnlockNode | ActionType.DiscoverRoutes | ActionType.ScanNode),
    id: NodePathId,
  } | {
    type: ActionType.Program,
    id: ProgramId,
  }
}

export interface IActionCompletion {
  stopRepeat: boolean;
}

export type Lens<T> = [set: StoreApi<T>['setState'], get: StoreApi<T>['getState']];

export type MyCreateSlice<T, A extends (() => any)[]> =
  (set: StoreApi<T>['setState'], get: StoreApi<T>['getState'], ...args: A) => T