import { Routes } from '@angular/router';
import { RootComponent } from './root.component';
import { HomeComponent } from './routes/home.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
];
