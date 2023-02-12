import { StoreApi } from "zustand";

export interface INode {
  id: string;
  x: number;
  y: number;
  name: string;
  requirement: number;
  requiredSkill: SkillType,
  connections: string[],
  isComplete: boolean;
}

export interface INodeProgress {
  node: INode;
  level: NodeLevel;
  minedAmount: number;
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

export type Lens<T> = [set: StoreApi<T>['setState'], get: StoreApi<T>['getState']];

export type MyCreateSlice<T, A extends (() => any)[]> =
  (set: StoreApi<T>['setState'], get: StoreApi<T>['getState'], ...args: A) => T