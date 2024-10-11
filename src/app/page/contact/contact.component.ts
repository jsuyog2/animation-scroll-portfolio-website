import { Component } from '@angular/core';
import gsap from 'gsap';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  providers: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  constructor(private loadingService: LoadingService) { }
  ngOnInit() {
    // console.log(this.deactGuard.canDeact);

  }
  ngAfterViewInit() {
    let load = this.loadingService.onInitalLoad()
    if (load.closed) {
      setTimeout(() => {
        console.log(load);
      }, 1);
    } else {
      load.subscribe(() => {
        this.loadingService.destroyOnInitalLoad();
        console.log(load);
        
      })
    }
  }

  canDeactivate(value: any) {
    return this.loadingService.navigatePage(value.url);
  }
}
