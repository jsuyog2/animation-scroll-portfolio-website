import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CursorService {
  hoverEvent: EventEmitter<any> = new EventEmitter();
  constructor() { }

  enableCopyCursor(value: boolean = false) {
    return this.hoverEvent.emit(value)
  }

  getenableCopyCursor() {
    return this.hoverEvent
  }
}
