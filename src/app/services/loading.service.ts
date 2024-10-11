import { EventEmitter, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  triggerLoading: EventEmitter<any> = new EventEmitter();
  loadingComplete: EventEmitter<any> = new EventEmitter();
  InitalLoading: EventEmitter<any> = new EventEmitter();
  constructor(private router: Router) { }
  onToggleLoading() {
    return this.triggerLoading
  }
  toggleLoading(title: string = 'Loading') {
    return this.triggerLoading.emit(title);
  }

  triggerLoadingComplete() {
    this.loadingComplete.emit();
  }
  onLoadingComplete() {
    return this.loadingComplete
  }

  onInitalLoad() {
    return this.InitalLoading
  }
  onInitalLoadComplete() {
    return this.InitalLoading.emit();
  }

  destroyOnInitalLoad() {
    return this.InitalLoading.unsubscribe();
  }

  navigatePage(value: any = null) {
    const deactivateSubject = new Subject<boolean>();
    var title = 'Loading';
    switch (value) {
      case '/':
        title = 'Home';
        break;
      case '/work':
        title = 'Work';
        break;
      case '/about':
        title = 'About';
        break;
      default:
        title = 'Loading';
        break;
    }
    this.toggleLoading(title);
    let load = this.onLoadingComplete().subscribe(() => {
      deactivateSubject.next(true)
      load.unsubscribe()
    })
    return deactivateSubject;
  }
}
