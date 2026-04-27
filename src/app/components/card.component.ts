import { Component, input } from "@angular/core";
import { Card } from "../models/card";

@Component({
    selector: 'card',
    template: `
<div class="card card-side shadow-sm cursor-pointer">
    <figure class="max-w-lg">
        <img [src]="'./' + card().img" alt="Movie" />
    </figure>

    <div class="card-body">
        <article class="prose leading-tight">
            <h2 class="card-title">{{ card().title }}</h2>
            <p>{{ card().description }}</p>
            <ul>
                <li><a class="link">Vicon GRAIL Workflow – Kalibrierung & Bewegungsanalyse</a></li>
            </ul>
        </article>
    </div>
</div>
    `,
})
export class CardComponent {
    card = input.required<Card>();
}