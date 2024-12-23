import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import data from '../../../../public/data.json';
import { CardModule } from 'primeng/card';
import { InfiniteGridComponent } from "../../components/infinite-grid/infinite-grid.component";
import gsap from 'gsap';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CardModule, CommonModule, InfiniteGridComponent],
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class WorkComponent {
  data: any = data.projects;
  constructor(private loadingService: LoadingService) { }
  ngOnInit() {
    this.data = this.data.map((val: any, index: any) => {
      val.id = index
      if (val.start_date) {
        const duration = this.returnDuration(val.start_date, val.end_date);
        val.duration = duration
      }
      return val
    })

  }

  ngAfterViewInit() {
    gsap.to(window, {
      duration: 1, scrollTo: 0
    });
  }
  canDeactivate(value: any) {
    return this.loadingService.navigatePage(value.url);
  }
  returnDuration(start_date: any, end_date: any) {
    let start = this.returnDateFormat(start_date);
    let end = end_date ? this.returnDateFormat(end_date) : 'Present';
    return `${start} - ${end}`;
  }

  returnDateFormat(date: any) {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date_month = month[new Date(date).getMonth()];
    let date_year = new Date(date).getFullYear();
    return `${date_month} ${date_year}`
  }
}
