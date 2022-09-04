export type TodoListItem = {
  ID: number;
  text: string;
};

export type TodoListInfo = {
  ListID: number;
  name: string;
  description: string;
};

export type TodoList = TodoListInfo & { items: TodoListItem[] };
