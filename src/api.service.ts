import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ApiService {

    http = inject(HttpClient);

    getInstruction() {
        return this.http.get("/content/steps.json");
    }
}