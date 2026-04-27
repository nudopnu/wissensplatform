import { Routes } from '@angular/router';
import { RootComponent } from './root.component';
import { HomeComponent } from './routes/home.component';
import { HumanComponent } from './routes/human.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'markersets', component: HumanComponent },
];
