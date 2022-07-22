import { Injectable } from '@angular/core';
import { TodoStore} from './todo.store';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {Todo} from "./todo.model";

@Injectable({ providedIn: 'root' })
export class TodoService  {
  private _urlTodo = 'http://localhost:3000/todo'

  constructor(
    protected todoStore: TodoStore,
    private http: HttpClient
  ) {
  }

  getAllTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this._urlTodo)
      .pipe(
        tap(entities => this.todoStore.set(entities))
      );
  }

  getTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this._urlTodo}/${id}`)
      .pipe(
        tap(entity => this.todoStore.add(entity))
      );
  }

  updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this._urlTodo}/${todo.id}`, todo)
      .pipe(
        tap(entity => this.todoStore.update(entity))
      );
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this._urlTodo, todo)
      .pipe(
        tap(entity => this.todoStore.add(entity))
      );
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this._urlTodo}/${id}`)
      .pipe(
        tap(entity => this.todoStore.remove(entity))
      );
  }
}
