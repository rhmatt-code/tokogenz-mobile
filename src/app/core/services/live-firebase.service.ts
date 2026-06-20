import { Injectable } from '@angular/core';

import {
  Database,
  ref,
  push,
  set,
  remove,
  onValue
} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class LiveFirebaseService {

  constructor(
    private db: Database
  ) {}

  sendMessage(
    liveId: number,
    message: any
  ) {

    const msgRef =
      ref(
        this.db,
        `live_rooms/${liveId}/messages`
      );

    return push(
      msgRef,
      message
    );

  }

  joinViewer(
    liveId: number,
    userId: number
  ) {

    return set(

      ref(
        this.db,
        `live_rooms/${liveId}/viewers/${userId}`
      ),

      true

    );

  }

  leaveViewer(
    liveId: number,
    userId: number
  ) {

    return remove(

      ref(
        this.db,
        `live_rooms/${liveId}/viewers/${userId}`
      )

    );

  }

}