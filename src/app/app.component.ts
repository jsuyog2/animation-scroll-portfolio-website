import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CursorComponent } from "./components/cursor/cursor.component";
import gsap from 'gsap';
import { ScrollTrigger, TextPlugin } from 'gsap/all';
import Lenis from 'lenis';
import { CursorService } from './services/cursor.service';
import { LoadingComponent } from "./components/loading/loading.component";
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CursorComponent, RouterModule, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Suyog Jadhav';
  enableCopyCursor = false;
  enableOpenCursor = false;
  loadingSub: any;
  constructor(private cursor: CursorService, private loadingService: LoadingService) { }

  ngOnInit() {
    gsap.registerPlugin(TextPlugin, ScrollTrigger)

    const lenis: any = new Lenis();

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    this.cursor.getenableCopyCursor().subscribe((value) => {
      this.enableCopyCursor = value
    })

    this.cursor.getenableOpenCursor().subscribe((value) => {
      this.enableOpenCursor = value
    })
  }

  ngAfterViewInit() {
    this.loadingSub = this.loadingService.onLoadingComplete().subscribe(() => {
      this.sectionNav();
    })

  }

  ngOnDestroy() {
    this.loadingSub.unsubscribe();
  }

  sectionNav() {
    gsap.set("nav", { translateY: -100 });
    gsap.to("nav", {
      duration: 2, ease: "power2.inOut", translateY: 0, onComplete: () => {
        gsap.set("nav", { delay: 2, translateY: 0, overwrite: true })
      }
    })
  }
}
