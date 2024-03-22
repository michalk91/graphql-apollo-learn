import { v4 } from "uuid";

export const todos = [
  {
    id: v4(),
    title: "Task first",
    description: "Task first description",
  },
  {
    id: v4(),
    title: "Task second",
    description: "Task second description",
  },
  {
    id: v4(),
    title: "Task third",
  },
];

export default todos;
