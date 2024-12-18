import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { LoadingService } from '../../services/loading.service';
import { TimelineModule } from 'primeng/timeline';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { ClipboardModule } from 'ngx-clipboard';
import data from '../../../../public/data.json';
import { ScrollTrigger } from 'gsap/all';
import { CursorService } from '../../services/cursor.service';
import { CursorComponent } from '../../components/cursor/cursor.component';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [TimelineModule, StepsModule, CommonModule, ClipboardModule],
  providers: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  @ViewChild('expTimeline') expTimeline: any;
  experience: any[] = [];
  education: any[] = [];
  data: any = data;
  enableCursor = false;
  visible: boolean = true;
  constructor(
    public cursor: CursorService,
    private loadingService: LoadingService
  ) {}
  ngOnInit() {
    data.experience.map((val: any) => {
      const duration = this.returnDuration(val.start_date, val.end_date);
      val.duration = duration;
      return val;
    });
    this.experience = data.experience;

    data.education.map((val: any) => {
      val.year = this.returnDateFormat(val.year);
      return val;
    });
    this.education = data.education;
  }
  ngAfterViewInit() {
    let load = this.loadingService.onInitalLoad();
    if (load.closed) {
      setTimeout(() => {
        this.initalLoad();
      }, 1);
    } else {
      load.subscribe(() => {
        this.loadingService.destroyOnInitalLoad();
        this.initalLoad();
      });
    }
  }
  returnDuration(start_date: any, end_date: any) {
    let start = this.returnDateFormat(start_date);
    let end = end_date ? this.returnDateFormat(end_date) : 'Present';
    return `${start} - ${end}`;
  }
  returnDateFormat(date: any) {
    const month = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let date_month = month[new Date(date).getMonth()];
    let date_year = new Date(date).getFullYear();
    return `${date_month} ${date_year}`;
  }
  initalLoad() {
    const page: any = document.querySelector('.contact-page');
    page.style.opacity = 1;
    setTimeout(() => {
      gsap.set(`.exp-content .timeline-item`, {
        y: 50,
        opacity: 0,
      });
      gsap.set(`.edu-content .timeline-item`, {
        y: 50,
        opacity: 0,
      });
      this.splitText('#exp-content-col', {
        opacity: 0,
        rotation: -25,
        x: 100,
        y: 100,
      });
      this.splitText('#edu-content-col', {
        opacity: 0,
        rotation: -25,
        x: 100,
        y: 100,
      });
      ScrollTrigger.create({
        trigger: '#exp-content-col',
        start: 'top center',
        end: 'bottom bottom',
        onEnter: () => {
          gsap.set(`.exp-content .timeline-item`, {
            y: 50,
            opacity: 0,
          });
          this.animateText(
            '#exp-content-col',
            {
              opacity: 0,
              rotation: -25,
              x: 100,
              y: 100,
            },
            false
          );
          this.drawLine('exp-content');
        },
      });

      ScrollTrigger.create({
        trigger: '#edu-content-col',
        start: 'top center',
        end: 'bottom bottom',
        onEnter: () => {
          gsap.set(`.edu-content .timeline-item`, {
            y: 50,
            opacity: 0,
          });
          this.animateText(
            '#edu-content-col',
            {
              opacity: 0,
              rotation: -25,
              x: 100,
              y: 100,
            },
            false
          );
          this.drawLine('edu-content');
        },
      });
      gsap.set(`iframe`, {
        scale: 0,
        opacity: 0,
      });
      ScrollTrigger.create({
        trigger: '.contact-section',
        start: 'top center',
        end: 'bottom bottom',
        onEnter: () => {
          gsap.set(`iframe`, {
            scale: 0,
            opacity: 0,
          });
          gsap.to(`iframe`, {
            scale: 1,
            opacity: 1,
          });
        },
      });
      gsap.set(`.card-form`, {
        scale: 0,
        opacity: 0,
      });
      ScrollTrigger.create({
        trigger: '.contact-section',
        start: 'top center',
        end: 'bottom bottom',
        onEnter: () => {
          gsap.set(`.card-form`, {
            scale: 0,
            opacity: 0,
          });
          gsap.to(`.card-form`, {
            scale: 1,
            opacity: 1,
          });
        },
      });
      gsap.to(`.about-section .scrollingText.animate span`, {
        duration: 1,
        opacity: 1,
        text: { value: this.data.contact.value },
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top 50%',
          end: 'bottom 90%',
          scrub: true,
        },
      });
    }, 150);
  }

  drawLine(className: string) {
    const timelineItems = gsap.utils.toArray(`.${className} .timeline-item`);
    const timelineLine = document.querySelector(`.${className} .timeline-line`);

    gsap.to(timelineItems, {
      y: 0,
      opacity: 1,
      stagger: 0.2,
      duration: 1,
      delay: 1,
      ease: 'power3.out',
    });
    gsap.fromTo(
      timelineLine,
      { height: 0 },
      { height: '100%', delay: 1, duration: 1.5, ease: 'power3.inOut' }
    );
  }

  splitText(
    element: string,
    options: any = {
      opacity: 0,
      rotation: -25,
      x: 100,
      y: 100,
    }
  ) {
    const word: any = document.querySelector(`${element} .scrollingText`);
    const height = word.offsetHeight;
    const text = word.textContent;
    const split = text.split('');
    word.innerHTML = '';
    word.style.height = height + 'px';
    split.forEach((char: string, index: number) => {
      const element = document.createElement('span');
      element.className = 'char-value';
      element.id = 'char-value-' + index;
      element.innerHTML = `${char}`;
      gsap.set(element, {
        ...options,
      });

      word.appendChild(element);
    });
  }

  animateText(
    element: string,
    options: any = {
      opacity: 0,
      rotation: -25,
      x: 100,
      y: 100,
    },
    scrollTrigger: boolean = true
  ) {
    const split = gsap.utils.toArray(`${element} .scrollingText .char-value`);
    split.forEach((elem: any, index: number) => {
      gsap.set(elem, {
        ...options,
      });
      var animateOptions: any = {
        autoAlpha: 1,
        duration: 1,
        display: 'inline-block',
        opacity: 1,
        rotation: 0,
        x: 0,
        y: 0,
      };
      if (!scrollTrigger) {
        animateOptions.delay = index / 5;
      }
      if (scrollTrigger) {
        animateOptions = {
          ...animateOptions,
          scrollTrigger: {
            trigger: element,
            start: 'top 50%-=' + `${(index + 1) * 10}px`,
            end: 'bottom 50%+=' + `${(index + 1) * 10}px`,
            scrub: true,
            markers: true,
          },
        };
      }
      gsap.to(elem, { ...animateOptions });
    });
  }

  canDeactivate(value: any) {
    return this.loadingService.navigatePage(value.url);
  }

  socialOpen(value: string) {
    switch (value) {
      case 'github':
        window.open(data.social.github, '_blank');
        break;
      case 'linkedin':
        window.open(data.social.linkedin, '_blank');
        break;
      case 'twitter':
        window.open(data.social.twitter, '_blank');
        break;
      case 'cv':
        window.open(data.cv_link, '_blank');
        break;
      case 'email':
        window.open(data.contact?.href, '_blank');
        break;
      case 'icons8':
        window.open('https://icons8.com/icons', '_blank');
        break;
      default:
        window.open(data.social.github, '_blank');
        break;
    }
  }
  toggleCursorEvent() {
    this.enableCursor = !this.enableCursor;
    this.cursor.enableCopyCursor(this.enableCursor);
  }
}
