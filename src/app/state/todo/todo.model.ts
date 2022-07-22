import {guid, ID} from '@datorama/akita';

export interface Todo {
  id: ID;
  title: string,
  author: string
}

export function createTodo() {
  return {
    id: guid(),
    title: '',
    author: ''
  } as Todo;
}
