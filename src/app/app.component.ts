import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged, forkJoin, mergeMap, Subject, takeUntil} from "rxjs";
import {ProfileService} from "./state/profile";
import {Todo, TodoService} from "./state/todo";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private _unsubscribe$ = new Subject()
  private _refresh$ = new Subject()
  todos: Todo[] = [];
  todosForm!: FormGroup;
  profileForm!: FormGroup;
  edit: boolean = false

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private profileService: ProfileService,
    private todoService: TodoService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this._initializeForm()
    this._getAllData()
    this._autoRefresh()
  }

  private _updateProfile() {
    this.profileForm.get('name')?.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      mergeMap((name) => this.profileService.updateProfile(name)),
      takeUntil(this._unsubscribe$)
    )
      .subscribe((profile) => this.profileForm.patchValue(profile));
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
    this._updateProfile();
  }

  private _getAllData() {
    forkJoin({
      profileOptions: this.profileService.getProfile(),
      todoOptions: this.todoService.getAllTodos(),
    })
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((res) => {
        this.profileForm.patchValue(res.profileOptions)
        this.todos = res.todoOptions
        this.changeDetectorRef.markForCheck()
      })
  }

  private _autoRefresh(): void {
    this._refresh$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => this._getAllData())
  }

  save() {
    let dto = this.todosForm?.getRawValue()
    if (this.edit) {
      this.todoService.updateTodo(dto).subscribe(() => this._refresh$.next(true))
      this.edit = false
    } else {
      this.todoService.addTodo(dto).subscribe(() => this._refresh$.next(true))
    }
    this.todosForm.reset()
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => this._refresh$.next(true))
  }

  getTodo(id: number) {
    this.edit = true
    this.todoService.getTodo(id).subscribe((todo) => this.todosForm.patchValue(todo))
  }
}
