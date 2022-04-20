import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import { GithubService, Repo } from '../github.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-repos-search',
  templateUrl: './repos-search.component.html',
  styleUrls: ['./repos-search.component.css'],
  providers: [GithubService]
})
export class ReposSearchComponent implements OnInit {

  searchValue: string;
  reposLoading: BooleanInput;
  githubService: GithubService;
  searchTimeout: ReturnType<typeof setTimeout>;
  searchResult: Repo[];
  searchDone: Boolean;
  searchError: HttpErrorResponse

  constructor(githubService: GithubService, private route: ActivatedRoute, private router: Router) { 
    this.githubService = githubService;
    this.searchValue = '';
    this.reposLoading = false;
    this.searchTimeout = setTimeout( ()=>{}, 0);
    this.searchResult = [];
    this.searchDone = false;
    this.searchError = new HttpErrorResponse({});
  }

  searchRepo(name: string, timeout: number) {
    clearTimeout(this.searchTimeout);

    if (name.length > 2) {
      this.searchTimeout = setTimeout(()=>{
          this.searchValue = name;
          
          this.router.navigateByUrl(`/?name=${this.searchValue}`)
          let loadingTimeout = setTimeout (() => {
            this.reposLoading = true;
          }, 1000)

          this.githubService.getRepos(name).subscribe({
            next: data => {this.searchResult = data; clearTimeout(loadingTimeout); this.reposLoading = false; this.searchDone = true},
            error: error => {console.log(this.searchError), clearTimeout(loadingTimeout); this.searchError = error; this.reposLoading = false}
          }
          );

        }, timeout);
    } else {
      this.searchResult = []
      this.searchValue = '';
      this.searchDone = false;
      this.searchError = new HttpErrorResponse({});
      this.router.navigateByUrl(`/`)
    }
  }

  onSearchInput(event: any): void {
    this.searchRepo(event.target.value, 2000)
  }

  onSearchEnter(event: any): void{
    this.searchRepo(event.target.value, 0)
  }
  
  goToLink(url: string): void{
    window.open(url, "_blank");
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if('name' in params) {
        this.searchRepo(params['name'], 0);
      }
    });
  }

}
