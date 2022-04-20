import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface Repo {
  id: string;
  name: string;
  stargazers_count: number;
  html_url: string
}

interface GitHubSearchResponse {
  "count": number;
  "items": Repo[];
}

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  
  httpClient: HttpClient;
  headers: HttpHeaders;
  searchURL: string;

  constructor(private http: HttpClient) { 
    this.httpClient = http;
    this.headers = new HttpHeaders({"Accept": "application/vnd.github.v3+json"});
    this.searchURL = "https://api.github.com/search/repositories";

  }

  getRepos(name: string) {
    const queryString = '?per_page=20&q=' + encodeURIComponent(`${name} in:name`);
    return this.httpClient.get<GitHubSearchResponse>(this.searchURL+queryString, {headers: this.headers}).pipe(
      map(response => response.items.map((item): Repo => ({
        id: item.id,
        name: item.name,
        stargazers_count: item.stargazers_count,
        html_url: item.html_url
    })))
    );

  }
}
