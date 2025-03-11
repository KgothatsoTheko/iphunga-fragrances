import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  serverUrl = environment.nodeUrlApi

  constructor(private http: HttpClient) { }

  genericPost(enpoint:any, body:any) {
    return this.http.post(this.serverUrl + enpoint, body)
  }

  genericGet(endpoint:any){
    return this.http.get(this.serverUrl + endpoint)
  }

  genericDelete(endpoints:string) {
    return this.http.delete(this.serverUrl + endpoints)
  }

  genericUpdate(endpoints:any, body:any) {
    return this.http.put(this.serverUrl + endpoints, body)
  }
}
