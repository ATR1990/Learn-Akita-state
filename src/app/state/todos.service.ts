import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { TodosStore } from './todos.store';

@Injectable({ providedIn: 'root' })
export class TodosService {

  constructor(private todosStore: TodosStore, private http: HttpClient) {
  }

  get() {
    return this.http.get('').pipe(tap(entities => this.todosStore.update(entities)));
  }

}
