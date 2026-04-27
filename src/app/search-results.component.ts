import { Component } from "@angular/core";

@Component({
    selector: "search-results",
    template: `
@for (manual of manuals; track $index) {
    <div class="card shadow-sm mt-4">
        <div class="card-body">
            <h2 class="card-title">Title</h2>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi quidem quas consequuntur modi, ad labore praesentium officia velit assumenda, error deserunt provident nihil autem! Odit temporibus nesciunt facilis illum consectetur?</p>
        </div>
    </div>
}
    `,
})
export class SearchResultsComponent {
    manuals = [1];
}