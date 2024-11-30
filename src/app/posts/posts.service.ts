import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private readonly API_URL = "https://jsonplaceholder.typicode.com/"

  constructor(private httpClient: HttpClient) { }


  getPhotos() {
    return this.httpClient.get<any[]>(`${this.API_URL}photos`);
  }

  getUsers() {
    return this.httpClient.get<any[]>(`${this.API_URL}users`);
  }

}
