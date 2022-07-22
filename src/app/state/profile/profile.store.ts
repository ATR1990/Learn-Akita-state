import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface ProfileState {
  name: string;
}

export function createInitialState(): ProfileState {
  return {
    name: ''
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'profile' })
export class ProfileStore extends Store<ProfileState> {

  constructor() {
    super(createInitialState());
  }

}
