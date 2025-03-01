import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Studio} from "../model/studio.model";

interface ApiResponse {
    message: string;
    data: any;
}

@Injectable({
  providedIn: 'root'
})
export class StudioService {
    constructor(private http: HttpClient) {}

    studiosEndpoint = "http://localhost:8080/api/studios";

    getAllStudios(): Observable<Studio[]> {
        return this.http.get<ApiResponse>(this.studiosEndpoint)
        .pipe(map((response) => response.data))
    }

    addStudio(name: string, type: string, site: string): Observable<Studio> {
        return this.http.post<Studio>(this.studiosEndpoint, { name, type, site });
    }

    deleteStudio(name: string): Observable<Studio> {
        const url = this.studiosEndpoint + `/${name}`;
        return this.http.delete<ApiResponse>(url)
        .pipe(map((res) => res.data))
    }
}
