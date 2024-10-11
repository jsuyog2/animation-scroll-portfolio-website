import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { rainbowCursor } from 'cursor-effects'
import gsap from 'gsap';
import { EasePack, TextPlugin } from 'gsap/all';

@Component({
  selector: 'app-cursor',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './cursor.component.html',
  styleUrl: './cursor.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CursorComponent {
  @Input('enable-copy-cursor') copyCursor: boolean = true;
  @Input('enable-open-cursor') openCursor: boolean = true;
  color = '#399dd2';
  xCopySetter: any;
  yCopySetter: any;
  xOpenSetter: any;
  yOpenSetter: any;
  time = 0;
  duration = Math.max(0.5, 6 * 0.08);
  tl = gsap.timeline({ delay: 0.6, scrub: true, });
  constructor() { }
  ngOnInit() {

  }

  ngAfterViewInit() {
    gsap.registerPlugin(TextPlugin, EasePack)
    this.xCopySetter = gsap.quickSetter(".copy-cursor", "x", "px")
    this.yCopySetter = gsap.quickSetter(".copy-cursor", "y", "px")

    const texts = gsap.utils.toArray(".copy-cursor .text-p");
    texts.forEach((text: any, index) => {
      this.tl.from(text, { opacity: 1, scale: 0, autoAlpha: 0, duration: .1 },)
        .addPause()
        .to(
          text,
          { opacity: 0, scale: 5, autoAlpha: 0, duration: .1 },
          ">+=1"
        );
    });

    this.xOpenSetter = gsap.quickSetter(".open-cursor", "x", "px")
    this.yOpenSetter = gsap.quickSetter(".open-cursor", "y", "px")

    rainbowCursor({
      length: 10,
      colors: [this.color],
      size: 5
    });
  }

  top: any;
  left: any;
  expand = false;
  index: any = 0;
  ngOnChanges() {
    this.tl.pause(1);
  }
  @HostListener('document:click', ['$event'])
  onClick($event: any) {

    if (this.copyCursor) {
      this.tl.play(1);
    }
    if (!this.copyCursor && !this.openCursor) {
      this.expand = true;
      setTimeout(() => {
        this.expand = false;
      }, 500)
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMousemove($event: any) {
    this.xCopySetter($event.pageX - 50)
    this.yCopySetter($event.pageY - 50)

    this.xOpenSetter($event.pageX - 50)
    this.yOpenSetter($event.pageY - 50)

    this.top = ($event.pageY - 10) + "px";
    this.left = ($event.pageX - 10) + "px";
  }
}
