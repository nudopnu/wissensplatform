import { Component } from "@angular/core";
import { Card } from "../models/card";
import { CardComponent } from "../components/card.component";

@Component({
    imports: [CardComponent],
    template: `
@for (card of cards; track $index) {
    <card [card]="card"></card>
}
    `,
})
export class HomeComponent {
    cards: Card[] = [
        {
            title: "GRAIL",
            description: "Anleitungen für die Verwendung des Gaited Realtime Analyses Labs (GRAIL).",
            link: "/",
            img: "grail.png",
            sublinks: {},
        },
        {
            title: "Markersets",
            description: "Eine Hilfestellung für das Anbringen von Markern für verschiedene Körpermodelle",
            img: "grail.png",
            link: "/",
        }
    ]
}