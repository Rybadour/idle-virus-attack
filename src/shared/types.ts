import { StoreApi } from "zustand";

export interface INode {
  id: string;
  x: number;
  y: number;
  connections: string[],
}

export type Lens<T> = [set: StoreApi<T>['setState'], get: StoreApi<T>['getState']];

export type MyCreateSlice<T, A extends (() => any)[]> =
  (set: StoreApi<T>['setState'], get: StoreApi<T>['getState'], ...args: A) => T