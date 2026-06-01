import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home.component';
import { InstructionsComponent } from './routes/instructions.component';
import { MarkersetComponent } from './routes/markerset.component';
import { GrailComponent } from './components/3d/grail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'markerset', component: MarkersetComponent },
    { path: 'instructions', component: InstructionsComponent },
    { path: 'grail-simulator', component: GrailComponent },
];
