import {
  Injectable
} from '@angular/core';

import {
  Database,
  ref,
  set,
  remove,
  onValue
} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private db: Database
  ) {}

}