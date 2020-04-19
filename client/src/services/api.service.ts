import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    defaultOptions: {
        observe: 'response',
        responseType: 'json'
    };

    constructor(private http: HttpClient) { }

    get(path: string, params: any | null) : Observable<any> {
        return this.http.get(
            `${environment.SERVER_ENDPOINT}${path}`,
            {
                ...this.defaultOptions,
                params
            }
        );
    }

    post(path: string, params: any | null) : Observable<any> {
        return this.http.post(
            `${environment.SERVER_ENDPOINT}${path}`,
            params,
            this.defaultOptions
        );
    }
}
