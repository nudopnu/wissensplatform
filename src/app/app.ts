import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
<navbar title="IZIT Wissensplattform" />
<main class="container mx-auto p-4">
  <router-outlet></router-outlet>
</main>
  `,
})
export class App { }
