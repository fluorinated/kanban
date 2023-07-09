import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BacklogLaneComponent } from './backlog-lane/backlog-lane.component';
import { ReadyToStartLaneComponent } from './ready-to-start-lane/ready-to-start-lane.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', redirectTo: 'tutorials', pathMatch: 'full' },
  { path: 'tutorials', component: AppComponent },
  { path: 'tutorials/:id', component: BacklogLaneComponent },
  { path: 'add', component: ReadyToStartLaneComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
