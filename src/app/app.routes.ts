import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { WorkComponent } from './page/work/work.component';
import { ContactComponent } from './page/contact/contact.component';
import { enableLoaderGuard } from './helper/enable-loader.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, canDeactivate: [enableLoaderGuard] },
    { path: 'work', component: WorkComponent, canDeactivate: [enableLoaderGuard] },
    { path: 'about', component: ContactComponent, canDeactivate: [enableLoaderGuard] },
];
