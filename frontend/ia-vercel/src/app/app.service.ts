import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: "root"
})

export class AppService {

    private apiUrl: string = ''

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: any
    ) {
        console.log("this.platform", this.platformId)
        if (isPlatformServer(this.platformId)) {
            this.apiUrl = environment.apiUrl
        }
    }

    getEndpointBack() {
        console.log("test", this.apiUrl)
        return this.http.get('http://localhost:4000/api/test')
    }

}