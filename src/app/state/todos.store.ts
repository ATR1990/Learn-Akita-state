import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface TodosState {
  key: string;
}

export function createInitialState(): TodosState {
  return {
    key: ''
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'todos' })
export class TodosStore extends Store<TodosState> {

  constructor() {
    super(createInitialState());
  }

}
