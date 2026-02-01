export interface Item {
  id: number;
  title: string;
  description?: string;
  assignedTo?: string;
  status: State;
  dueDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export enum State {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}
