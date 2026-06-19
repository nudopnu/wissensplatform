import { Component, inject, input } from "@angular/core";
import { Card } from "../models/card";
import { Router, RouterLink } from "@angular/router";

@Component({
    selector: 'card',
    template: `
<div class="card card-side p-2 bg-base-100 shadow-sm cursor-pointer" (click)="onclick(card())">
    <figure class="flex-none basis-1/2">
        <img [src]="'./' + card().img" width="800" height="500" [alt]="card().img" />
    </figure>

    <div class="card-body">
        <article class="prose leading-tight">
            <h2 class="card-title">{{ card().title }}</h2>
            <p>{{ card().description }}</p>
            @if (card().sublinks) {
                <ul>
                    @for (sublink of card().sublinks; track $index) {
                        <li><a class="link" [routerLink]="sublink.link">{{ sublink.label }}</a></li>
                    }
                </ul>
            }
        </article>
    </div>
</div>
    `,
    imports: [RouterLink],
})
export class CardComponent {
    card = input.required<Card>();
    router = inject(Router);

    onclick = (card: Card) => this.router.navigate([card.link]);
}