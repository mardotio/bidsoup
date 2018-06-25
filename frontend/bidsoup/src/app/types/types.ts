export interface Task {
  url: string;
  title: string;
  cost: number;
  children: Task[];
}
