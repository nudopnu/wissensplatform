import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar.component';

@Component({
  selector: 'app-root',
  host: { class: 'bg-base-200 flex flex-col h-dvh' },
  imports: [RouterOutlet, NavbarComponent],
  template: `
<navbar title="IZIT Wissensplattform" />
<section class="overflow-y-scroll grow relative">
  <router-outlet></router-outlet>
</section>
  `,
})
export class App { }
