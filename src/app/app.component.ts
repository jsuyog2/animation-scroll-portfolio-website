import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CursorComponent } from "./components/cursor/cursor.component";
import gsap from 'gsap';
import { ScrollTrigger, TextPlugin } from 'gsap/all';
import Lenis from 'lenis';
import { CursorService } from './services/cursor.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CursorComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Suyog Jadhav';
  enableCursor = false;

  constructor(private cursor: CursorService) { }

  ngOnInit() {
    gsap.registerPlugin(TextPlugin, ScrollTrigger)

    const lenis: any = new Lenis();

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    this.cursor.getenableCopyCursor().subscribe((value) => {
      this.enableCursor = value
    })
  }

  ngAfterViewInit() {
    this.opacityAnimation("nav", "");
    this.topLeftSlideAnimation("nav", ".btn");
  }

  opacityAnimation(trigger: string, className: string) {
    gsap.to(`${trigger} ${className}`, {
      opacity: 1,
      scrollTrigger: {
        trigger: trigger,
        start: '-=500',
        end: "+=500",
        scrub: true
      }
    })
  }

  topLeftSlideAnimation(trigger: string, className: string) {
    gsap.to(`${trigger} ${className}`, {
      opacity: 1,
      translateX: 0,
      translateY: 0,
      scrollTrigger: {
        trigger: trigger,
        start: '-=500',
        end: "+=500",
        scrub: true,
      }
    });
  }
}
