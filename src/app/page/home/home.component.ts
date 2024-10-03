import { Component } from '@angular/core';
import gsap from 'gsap';
import { MenuItem } from 'primeng/api';
import data from './../../../../public/data.json';
import { ScrollTrigger, TextPlugin } from 'gsap/all';
import { CursorComponent } from "../../components/cursor/cursor.component";
import { ClipboardModule } from 'ngx-clipboard';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CursorService } from '../../services/cursor.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CursorComponent, CommonModule, ButtonModule, CardModule, MenubarModule, ClipboardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  items: MenuItem[] = [
    {
      label: 'Home'
    },
    {
      label: 'Experience'
    },
    {
      label: 'Contact'
    }
  ]
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
  constructor(private cursor: CursorService) { }
  ngOnInit() {
    this.addService();
    gsap.registerPlugin(TextPlugin, ScrollTrigger)
    this.mm = gsap.matchMedia();

  }

  toggleCursorEvent() {
    this.enableCursor = !this.enableCursor
    this.cursor.enableCopyCursor(this.enableCursor);
  }



  ngAfterViewInit() {
    gsap.to("#title-name", {
      duration: 2,
      text: { value: "Suyog Jadhav" }
    })

    const subheaderTimeline = gsap.timeline({ repeat: -1, yoyo: true });
    this.subHeaderArray.forEach((element: any) => {
      subheaderTimeline.to(".inside-bottom-text", {
        duration: 3,
        delay: 1,
        text: { value: element }
      })
    });



    gsap.to(".banner-section", {
      scale: '0',
      opacity: 0,
      scrollTrigger: {
        trigger: ".banner-section",
        start: 'top',
        end: "bottom",
        scrub: true
      }
    });


    //work on desktop and tablet only
    this.mm.add("(min-width: 768px)", () => {
      gsap.to(".first-col", {
        translateX: 100,
        scrollTrigger: {
          trigger: "nav",
          start: 'top',
          end: "+=1000",
          scrub: true
        }
      });

      gsap.to(".last-col", {
        translateX: -100,
        scrollTrigger: {
          trigger: "nav",
          start: 'top',
          end: "+=1000",
          scrub: true
        }
      });

      gsap.to(".banner-pic", {
        scale: 1.1,
        scrollTrigger: {
          trigger: "nav",
          start: 'top',
          end: "+=1000",
          scrub: true
        }
      });
    });

    this.headerAnimation(".about-section", "about");
    this.opacityAnimation(".about-section", ".about-text");

    this.topLeftSlideAnimation('.about-section', ".btn");
    this.opacityAnimation('.about-section', '.counts-value');

    this.services.forEach((val: any) => {
      this.increaseNumber('.counts-value', `.${val.class}.counts`, val.label);
    })


    let sections = gsap.utils.toArray(".panel");
    let widthOfScreen: any = document.querySelector(".expertise-section");

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".expertise-section",
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => "+=" + widthOfScreen?.offsetWidth
      }
    });

    this.headerAnimation(".expertise-section", "Discover my creative expertise")

    gsap.to(".contact-section .header-title", {
      opacity: 1,
      scale: '1',
      scrollTrigger: {
        trigger: ".contact-section",
        start: '-=350',
        end: 'bottom bottom',
        scrub: true
      }
    })

    this.headerAnimation(".contact-section", this.data.contact.value);

    this.topLeftSlideAnimation(".contact-section", ".btn");

    gsap.to(".footer", {
      scale: '1',
      scrollTrigger: {
        trigger: ".contact-section",
        start: '-=100',
        end: "bottom bottom",
        scrub: true
      }
    });
  }

  addService() {
    const totalProjects = data.projects.length;
    const startExperienceDate = data.experience[data.experience.length - 1].start_date
    const currentDate: number = new Date().getFullYear();
    const startDate: number = new Date(startExperienceDate).getFullYear();
    const totalExperience = currentDate - startDate;
    this.services = [{
      class: 'projectc',
      icon: 'fa-solid fa-fire',
      label: totalProjects,
      text: 'Projects Complete'
    },
    {
      class: 'ccoffee',
      icon: 'fa-solid fa-mug-hot',
      label: (((totalExperience * 365) + totalProjects)) * 3,
      text: 'Cup of Coffee'
    },
    {
      class: 'yearse',
      icon: 'fa-solid fa-briefcase',
      label: totalExperience,
      text: 'Years Experience'
    }];
  }

  socialOpen(value: string) {
    switch (value) {
      case 'github':
        window.open(data.social.github, "_blank");
        break;
      case 'linkedin':
        window.open(data.social.linkedin, "_blank");
        break;
      case 'twitter':
        window.open(data.social.twitter, "_blank");
        break;
      case 'cv':
        window.open(data.cv_link, "_blank");
        break;
      case 'email':
        window.open(data.contact?.href, "_blank");
        break;
      case 'icons8':
        window.open("https://icons8.com/icons", "_blank");
        break;
      default:
        window.open(data.social.github, "_blank");
        break;
    }
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

  headerAnimation(trigger: string, text: string) {
    gsap.to(`${trigger} .scrollingText.animate span`, {
      duration: 1,
      opacity: 1,
      text: { value: text },
      scrollTrigger: {
        trigger: trigger,
        start: '-=500',
        end: "+=350",
        scrub: true
      }
    })
  }

  increaseNumber(trigger: string, className: string, number: number = 0) {
    gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        scrub: true,
        start: '-=600',
        end: "+=100",
        toggleActions: "restart none none reverse"
      }
    })
      .to(className, {
        textContent: number,
        duration: 1,
        snap: { textContent: 1 },
        ease: "none"
      });
  }



}
