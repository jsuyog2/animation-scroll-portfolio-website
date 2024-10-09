import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  triggerLoading: EventEmitter<any> = new EventEmitter();
  loadingComplete: EventEmitter<any> = new EventEmitter();
  constructor() { }
  onToggleLoading() {
    return this.triggerLoading
  }
  toggleLoading(title:string = 'Loading') {
    return this.triggerLoading.emit(title);
  }

  triggerLoadingComplete() {
    this.loadingComplete.emit();
  }
  onLoadingComplete() {
    return this.loadingComplete
  }
}
