import { Component, inject, input } from "@angular/core";
import { Card } from "../models/card";
import { Router, RouterLink } from "@angular/router";

@Component({
    selector: 'card',
    template: `
<div class="card card-side bg-base-100 shadow-sm cursor-pointer" (click)="onclick(card())">
    <figure class="flex-none basis-1/2">
        <img [src]="'./' + card().img" alt="Movie" />
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
    tes = inject(Router);

    onclick(card: Card) {
        console.log(card);
        this.tes.navigate([card.link]);
    }
}