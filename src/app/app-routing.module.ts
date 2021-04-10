import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { PageNotFoundComponent } from './home/page-not-found/page-not-found.component';
import { RecoverComponent } from './home/body/recover/recover.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
// @NgModule({
//   imports: [
//     RouterModule.forRoot([
//       { path: 'recover/:id', component: RecoverComponent },
//       { path: '', component: HomeComponent },
//       { path: '**', component: PageNotFoundComponent },
//     ]),
//   ],
//   exports: [RouterModule],
// })
export class AppRoutingModule {}
