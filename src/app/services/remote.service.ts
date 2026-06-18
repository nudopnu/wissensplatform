import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class RemoteService {

    BASE_URL = "http://192.168.1.50:1234"
    http = inject(HttpClient);

    getLogs = () => firstValueFrom(this.http.get<string>(`${this.BASE_URL}/logs`));
    getSequences = () => firstValueFrom(this.http.get(`${this.BASE_URL}/sequences`));
    startAgent = () => firstValueFrom(this.http.post(`${this.BASE_URL}/agent/start`, null));
    saveSequence = (name: string, content: string) => firstValueFrom(this.http.post(`${this.BASE_URL}/sequences/${name}`, content));
    runSequence = (name: string) => firstValueFrom(this.http.post(`${this.BASE_URL}/sequences/${name}/start`, null));
    startDFlow = () => firstValueFrom(this.http.post(`${this.BASE_URL}/agent/run/dflow`, null));

}