export interface Task {
  url: string;
  parent?: string;
  title: string;
  cost: number;
  description?: string;
  children: Task[];
}
