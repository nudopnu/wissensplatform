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
            link: "/",
            img: "grail.png",
            sublinks: [],
        },
        {
            title: "Markersets",
            description: "Eine Hilfestellung für das Anbringen von Markern für verschiedene Körpermodelle",
            img: "markers.png",
            link: "/markerset",
            sublinks: [],
        },
        {
            title: "Plugin Gait Protokoll",
            description: "Schritt-für-Schritt-Anleitung für das Plugin Gait Markerset — von der Patientenvorbereitung bis zur Datenerhebung.",
            img: "markers.png",
            link: "/instructions",
            sublinks: [],
        },
    ]
}