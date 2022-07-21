import {Component, OnInit} from '@angular/core';
import {ITodo} from "./models/todo.model";
import {TodosService} from "./services/todos.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged, forkJoin, mergeMap, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private _unsubscribe$ = new Subject()
  todos: ITodo[] = []
  todosForm!: FormGroup;
  profileForm!: FormGroup;
  edit: boolean = false

  constructor(private todosService: TodosService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this._initializeForm()
    this._getAllData()
    this._autoRefresh()
  }

  private _initializeForm() {
    this.todosForm = this.fb.group({
      id: [''],
      title: [''],
      author: ['']
    })
    this.profileForm = this.fb.group({
      name: ['']
    })
    this.updateProfile();
  }

  private _getAllData() {
    forkJoin({
      profileOptions: this.todosService.getProfile(),
      todoOptions: this.todosService.getAllTodos(),
    })
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((res) => {
        this.profileForm.patchValue(res.profileOptions)
        this.todos = res.todoOptions
      })
  }

  private _autoRefresh(): void {
    this.todosService.refresh$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => this._getAllData())
  }

  updateProfile() {
    this.profileForm.get('name')?.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      mergeMap((name) => this.todosService.updateProfile(name)),
      takeUntil(this._unsubscribe$)
    )
      .subscribe((profile) => this.profileForm.patchValue(profile));
  }

  save() {
    let dto = this.todosForm?.getRawValue()
    if (this.edit) {
      this.todosService.updateTodo(dto).subscribe(() => this.todosService.refresh$.next())
      this.edit = false
    } else {
      this.todosService.addTodo(dto).subscribe(() => this.todosService.refresh$.next())
    }
    this.todosForm.reset()
  }

  deleteTodo(id: number) {
    this.todosService.deleteTodo(id).subscribe(() => this.todosService.refresh$.next())
  }

  getTodo(id: number) {
    this.edit = true
    this.todosService.getTodo(id).subscribe((todo) => this.todosForm.patchValue(todo))
  }
}
