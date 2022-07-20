import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { TodosStore, TodoState } from './todos.store';

@Injectable({ providedIn: 'root' })
export class TodosQuery extends Query<TodoState> {

  constructor(protected store: TodosStore) {
    super(store);
  }

}
