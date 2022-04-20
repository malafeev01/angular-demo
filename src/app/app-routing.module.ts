import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReposSearchComponent } from './repos-search/repos-search.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
