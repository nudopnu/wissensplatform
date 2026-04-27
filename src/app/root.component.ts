import { Component } from "@angular/core";
import { SearchComponent } from "./components/search.component";
import { SearchResultsComponent } from "./search-results.component";

@Component({
    imports: [SearchComponent, SearchResultsComponent],
    template: `
<h1 class="text-3xl font-bold pb-2">Anleitungen</h1>
<search></search>
<search-results></search-results>
    `,
})
export class RootComponent { }