import { Item, State } from './item';

export interface List {
  id: string;
  title: string;
  items: Item[];
  createdAt: Date;
  updatedAt?: Date;
  status: State;
}
