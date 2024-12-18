import { Component } from '@angular/core';
import gsap from 'gsap';
import { MenuItem } from 'primeng/api';
import data from './../../../../public/data.json';
import { CursorComponent } from '../../components/cursor/cursor.component';
import { ClipboardModule } from 'ngx-clipboard';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CursorService } from '../../services/cursor.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    MenubarModule,
    ClipboardModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  items: MenuItem[] = [
    {
      label: 'Home',
    },
    {
      label: 'Experience',
    },
    {
      label: 'Contact',
    },
  ];
  subHeaderArray: any = [
    `Full Stack Developer`,
    `Front-End Developer`,
    `Back-End Developer`,
  ];
  data: any = data;
  services: any;
  experience: any;

  projects: any;
  enableCursor = false;

  mm: any;
  loadingSub: any;
  constructor(
    public cursor: CursorService,
    public loadingService: LoadingService
  ) {}
  ngOnInit() {
    this.addService();
  }

  initalLoad() {
    const page: any = document.querySelector('.home-page');
    page.style.opacity = 1;
    this.mm = gsap.matchMedia();
    this.sectionMain();
    this.sectionAbout();
    this.sectionExpertise();
    this.sectionContact();
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
  canDeactivate(value: any) {
    return this.loadingService.navigatePage(value.url);
  }
  sectionMain() {
    gsap.set('.first-col', { translateX: -100 });
    gsap.to('.first-col', {
      duration: 2,
      ease: 'power2.inOut',
      translateX: 0,
      onComplete: () => {
        gsap.set('.first-col', { delay: 2, translateX: 0, overwrite: true });
        gsap.to('.first-col', {
          translateX: '-200vw',
          overwrite: true,
          scrollTrigger: {
            trigger: '.banner-section',
            start: 'top top',
            end: 'bottom center',
            scrub: true,
          },
        });
      },
    });

    gsap.set('.mid-col', { scale: 0 });
    gsap.to('.mid-col', {
      duration: 2,
      ease: 'power2.inOut',
      scale: 1,
      onComplete: () => {
        gsap.set('.mid-col', { scale: 1 });
        gsap.to('.mid-col', {
          translateY: '100vh',
          opacity: 0,
          scrollTrigger: {
            trigger: '.banner-section',
            start: 'top top',
            end: 'bottom center',
            scrub: true,
          },
        });
      },
    });

    gsap.set('.last-col', { translateX: 100 });
    gsap.to('.last-col', {
      duration: 2,
      ease: 'power2.inOut',
      translateX: 0,
      onComplete: () => {
        gsap.set('.last-col', { delay: 2, translateX: 0, overwrite: true });
        gsap.to('.last-col', {
          translateX: '200vw',
          overwrite: true,
          scrollTrigger: {
            trigger: '.banner-section',
            start: 'top top',
            end: 'bottom center',
            scrub: true,
          },
        });
      },
    });

    gsap.to('#title-name', {
      delay: 3,
      duration: 5,
      text: { value: 'Suyog Jadhav' },
    });
    const subheaderTimeline = gsap.timeline({ repeat: -1, yoyo: true });
    this.subHeaderArray.forEach((element: any) => {
      subheaderTimeline.to('.inside-bottom-text', {
        duration: 3,
        delay: 1,
        text: { value: element },
      });
    });
  }

  sectionAbout() {
    let section = `.about-section`;
    let aboutSectionRow = gsap.utils.toArray('.about-section-row');

    gsap.to(`${section} .scrollingText.animate span`, {
      duration: 1,
      opacity: 1,
      text: { value: `about` },
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'top center',
        scrub: true,
      },
    });

    aboutSectionRow.forEach((elem: any) => {
      gsap.set(elem, {
        translateX: '50vw',
        opacity: 0,
      });

      gsap.to(elem, {
        opacity: 1,
        translateX: 0,
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top center',
          scrub: true,
        },
      });
    });

    let countsValue = gsap.utils.toArray('.counts-value');
    countsValue.forEach((elem: any) => {
      gsap.set(elem, {
        translateX: '50vw',
        opacity: 0,
      });

      gsap.to(elem, {
        opacity: 1,
        translateX: 0,
        scrollTrigger: {
          trigger: elem,
          start: 'top 75%',
          end: 'top center',
          scrub: true,
        },
      });
    });

    this.services.forEach((val: any) => {
      this.increaseNumber('.counts-value', `.${val.class}.counts`, val.label);
    });
  }

  sectionExpertise() {
    let section = `.expertise-section`;
    let endSection = `.expertise-section-end-header`;

    gsap.set(`${section} .expertise-section-header`, {
      translateX: '50vw',
      opacity: 0,
    });

    gsap.to(`${section} .expertise-section-header`, {
      opacity: 1,
      translateX: 0,
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'top center',
        scrub: true,
      },
    });

    gsap.to(`${section} .scrollingText.animate span`, {
      duration: 1,
      opacity: 1,
      text: { value: `Discover my creative expertise` },
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'top center',
        scrub: true,
      },
    });

    let skillRow = gsap.utils.toArray('.skill-row');
    skillRow.forEach((elem: any) => {
      gsap.set(elem, {
        translateX: '50vw',
        opacity: 0,
      });

      gsap.to(elem, {
        opacity: 1,
        translateX: 0,
        scrollTrigger: {
          trigger: elem,
          start: 'top 75%',
          end: 'top center',
          scrub: true,
        },
      });
    });

    gsap.set(`${endSection}`, {
      translateX: '50vw',
      opacity: 0,
    });

    gsap.to(`${endSection}`, {
      opacity: 1,
      translateX: 0,
      scrollTrigger: {
        trigger: endSection,
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: true,
      },
    });
  }

  sectionContact() {
    let section = `.contact-section`;
    gsap.set(`${section} .header-title`, {
      translateX: '50vw',
      opacity: 0,
    });

    gsap.to(`${section} .header-title`, {
      opacity: 1,
      translateX: 0,
      scrollTrigger: {
        trigger: section,
        start: 'top 90%',
        end: 'bottom 90%',
        scrub: true,
      },
    });

    gsap.set(`${section} .scrollingText`, {
      translateX: '50vw',
      opacity: 0,
    });

    gsap.to(`${section} .scrollingText`, {
      opacity: 1,
      translateX: 0,
      scrollTrigger: {
        trigger: section,
        start: 'top 90%',
        end: 'bottom 90%',
        scrub: true,
      },
    });

    gsap.to(`${section} .scrollingText.animate span`, {
      duration: 1,
      opacity: 1,
      text: { value: this.data.contact.value },
      scrollTrigger: {
        trigger: section,
        start: 'top 90%',
        end: 'bottom 90%',
        scrub: true,
      },
    });

    let contactSectionBtns = gsap.utils.toArray('.contact-section-btn');
    contactSectionBtns.forEach((elem: any) => {
      gsap.set(elem, {
        translateX: '50vw',
        opacity: 0,
      });

      gsap.to(elem, {
        opacity: 1,
        translateX: 0,
        scrollTrigger: {
          trigger: section,
          start: 'top 90%',
          end: 'bottom 90%',
          scrub: true,
        },
      });
    });

    gsap.set('.footer .row', {
      translateY: '50vh',
      opacity: 0,
    });

    gsap.to('.footer .row', {
      translateY: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 90%',
        end: 'bottom 100%+10',
        scrub: true,
      },
    });
  }

  addService() {
    const totalProjects = data.projects.length;
    const startExperienceDate =
      data.experience[data.experience.length - 1].start_date;
    const currentDate: number = new Date().getFullYear();
    const startDate: number = new Date(startExperienceDate).getFullYear();
    const totalExperience = currentDate - startDate;
    this.services = [
      {
        class: 'projectc',
        icon: 'fa-solid fa-fire',
        label: totalProjects,
        text: 'Projects Complete',
      },
      {
        class: 'ccoffee',
        icon: 'fa-solid fa-mug-hot',
        label: (totalExperience * 365 + totalProjects) * 3,
        text: 'Cup of Coffee',
      },
      {
        class: 'yearse',
        icon: 'fa-solid fa-briefcase',
        label: totalExperience,
        text: 'Years Experience',
      },
    ];
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

  increaseNumber(trigger: string, className: string, number: number = 0) {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: trigger,
          scrub: true,
          start: 'top 70%',
          end: 'bottom 50%',
          toggleActions: 'restart none none reverse',
        },
      })
      .to(className, {
        textContent: number,
        duration: 1,
        snap: { textContent: 1 },
        ease: 'none',
      });
  }
  toggleCursorEvent() {
    this.enableCursor = !this.enableCursor;
    this.cursor.enableCopyCursor(this.enableCursor);
  }
}
