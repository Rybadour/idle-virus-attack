import { StoreApi } from "zustand";

export interface INode {
  id: string;
  x: number;
  y: number;
  connections: string[],
  isComplete: boolean;
}

export interface INodeProgress {
  nodeId: string;
  level: NodeLevel;
  minedAmount: number;
}

export enum NodeLevel {
  Internet = 'internet',
  Infranet = 'infranet',
  Computer = 'computer',
}

export type Lens<T> = [set: StoreApi<T>['setState'], get: StoreApi<T>['getState']];

export type MyCreateSlice<T, A extends (() => any)[]> =
  (set: StoreApi<T>['setState'], get: StoreApi<T>['getState'], ...args: A) => T