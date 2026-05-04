import { Component } from "@angular/core";
import { Card } from "../models/card";
import { CardComponent } from "../components/card.component";

@Component({
    imports: [CardComponent],
    template: `
<main class="container mx-auto p-4 flex flex-col gap-4">
    @for (card of cards; track $index) {
        <card [card]="card"></card>
    }
</main>
    `,
})
export class HomeComponent {
    cards: Card[] = [
        {
            title: "GRAIL",
            description: "Anleitungen für die Verwendung des Gaited Realtime Analyses Labs (GRAIL).",
            link: "/instructions",
            img: "grail.jpg",
            sublinks: [
                { label: "Ganzkörperaufzeichnung für die Ganganalyse", link: "/instructions" }
            ],
        },
        {
            title: "Markersets",
            description: "Eine Hilfestellung für das Anbringen von Markern für verschiedene Körpermodelle",
            img: "markers.jpg",
            link: "/markerset",
            sublinks: [
                { label: "Ganzkörpermodell (Plug-in Gait + vKAD)", link: "/markerset" },
            ],
        },
    ]
}