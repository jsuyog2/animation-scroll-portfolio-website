import { Component, Input } from '@angular/core';
import gsap from 'gsap';
import { LoadingService } from '../../services/loading.service';
import { ScrollToPlugin } from 'gsap/all';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  @Input('title') input: string = 'Loading'
  loadingTl = gsap.timeline();
  constructor(private loadingService: LoadingService) { }
  ngOnInit() {
    gsap.registerPlugin(ScrollToPlugin)
  }
  ngAfterViewInit() {
    this.initalLoading()
    this.triggerLoading();
    let loading = this.loadingService.onToggleLoading().subscribe((title: any) => {
      this.triggerLoading(title);
    })
  }

  initalLoading() {
    let initalLoad = true
    this.loadingTl.set('html,body', { overflow: 'hidden' })
    this.loadingTl.set('.loading', { opacity: 1, scale: 1 })
    this.loadingTl.set('.bottom', { width: 0 })

    this.loadingTl.from('.loading', {
      opacity: 0,
      scale: 200,
      display: 'none',
      ease: "power4.inOut",
      duration: 0.5
    })

    this.loadingTl.to('.bottom', {
      width: '100%',
      duration: 3,
      ease: "power3.inOut",
      onComplete: () => {
        if (initalLoad) {
          this.loadingService.onInitalLoadComplete();
          initalLoad = false;
        }

        this.loadingService.triggerLoadingComplete();
      }
    });

    this.loadingTl.to('.loading', {
      opacity: 0,
      scale: 200,
      display: 'none',
      ease: "power4.inOut",
      duration: 3
    })

    this.loadingTl.set('html,body', { overflowY: 'auto' });
  }

  public triggerLoading(title: any = 'Loading') {
    this.input = title;
    gsap.set('.text', { text: title })
    gsap.set('.top', { text: title })
    setTimeout(() => {
      gsap.to(window, { duration: 1, scrollTo: 0 });
      this.loadingTl.restart()
    }, 1);

  }
}
