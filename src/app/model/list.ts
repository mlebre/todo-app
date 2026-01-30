import { Item } from './item';

export interface List {
  id: number;
  title: string;
  items: Item[];
  createdAt: Date;
  updatedAt: Date;
}
