import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CursorService {
  hoverCopyEvent: EventEmitter<any> = new EventEmitter();
  hoverOpenEvent: EventEmitter<any> = new EventEmitter();
  constructor() { }

  enableCopyCursor(value: boolean = false) {
    return this.hoverCopyEvent.emit(value)
  }

  enableOpenCursor(value: boolean = false) {
    return this.hoverOpenEvent.emit(value)
  }

  getenableCopyCursor() {
    return this.hoverCopyEvent
  }

  getenableOpenCursor() {
    return this.hoverOpenEvent
  }
}
