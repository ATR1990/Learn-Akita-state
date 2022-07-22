import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import {ProfileState, ProfileStore} from './profile.store';
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private _urlProfile = 'http://localhost:3000/profile'

  constructor(private profileStore: ProfileStore, private http: HttpClient) {
  }

  getProfile(): Observable<ProfileState> {
    return this.http.get<ProfileState>(this._urlProfile).pipe(tap(entities => this.profileStore.update(entities)));
  }

  updateProfile(name: string): Observable<ProfileState> {
    let profile = { name }
    return this.http.put<ProfileState>(`${this._urlProfile}`, profile)
  }

}
