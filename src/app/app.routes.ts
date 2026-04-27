import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home.component';
import { MarkersetComponent } from './routes/markerset.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'markerset', component: MarkersetComponent },
];
