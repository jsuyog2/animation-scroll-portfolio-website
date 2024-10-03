import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { ExperienceComponent } from './page/experience/experience.component';
import { ContactComponent } from './page/contact/contact.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'experience', component: ExperienceComponent },
    { path: 'contact', component: ContactComponent },
];
