import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {IProfile, ITodo} from "../models/todo.model";

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private _urlTodo = 'http://localhost:3000/todo'
  private _urlProfile = 'http://localhost:3000/profile'
  refresh$ = new Subject<void>()

  constructor(private http: HttpClient) { }

  getProfile(): Observable<IProfile> {
    return this.http.get<IProfile>(this._urlProfile)
  }

  updateProfile(name: string): Observable<IProfile> {
    let profile = { name }
    return this.http.put<IProfile>(`${this._urlProfile}`, profile)
  }

  getAllTodos(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(this._urlTodo)
  }

  getTodo(id: number): Observable<ITodo> {
    return this.http.get<ITodo>(`${this._urlTodo}/${id}`)
  }

  updateTodo(todo: ITodo): Observable<ITodo> {
    return this.http.put<ITodo>(`${this._urlTodo}/${todo.id}`, todo)
  }

  addTodo(todo: ITodo): Observable<ITodo> {
    return this.http.post<ITodo>(this._urlTodo, todo)
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this._urlTodo}/${id}`)
  }
}
