import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { WorkComponent } from './page/work/work.component';
import { ContactComponent } from './page/contact/contact.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'work', component: WorkComponent },
    { path: 'contact', component: ContactComponent },
];
