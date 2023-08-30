import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BacklogLaneComponent } from './backlog-lane/backlog-lane.component';
import { BoardComponent } from './board/board.component';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';
import { MiniCardComponent } from './mini-card/mini-card.component';
import { ReadyToStartLaneComponent } from './ready-to-start-lane/ready-to-start-lane.component';
import { SearchComponent } from './search/search.component';
import { SwimlaneComponent } from './swimlane/swimlane.component';
import { TagsComponent } from './tags/tags.component';
import { TicketComponent } from './ticket/ticket.component';
import { BoardService } from './board/board.service';
import { InProgressLaneComponent } from './in-progress-lane/in-progress-lane.component';
import { BlockedLaneComponent } from './blocked-lane/blocked-lane.component';
import { DoneLaneComponent } from './done-lane/done-lane.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconComponent } from './icon/icon.component';
import { BoardsListComponent } from './boards-list/boards-list.component';
import { BoardStore } from './board/store/board-store.service';
import { TicketStore } from './ticket/store/ticket-store.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FiltersListComponent } from './filters-list/filters-list.component';
import { HttpClientModule } from '@angular/common/http';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { SwimlaneStore } from './swimlane/store/swimlane-store.service';
import { SwimlaneService } from './swimlane/swimlane.service';
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    BoardComponent,
    MiniCardComponent,
    ButtonComponent,
    TicketComponent,
    InputComponent,
    SearchComponent,
    TagsComponent,
    SwimlaneComponent,
    BacklogLaneComponent,
    ReadyToStartLaneComponent,
    InProgressLaneComponent,
    BlockedLaneComponent,
    DoneLaneComponent,
    IconComponent,
    BoardsListComponent,
    FiltersListComponent,
    DeleteModalComponent,
    PaginatorComponent,
  ],
  providers: [
    BoardService,
    BoardStore,
    TicketStore,
    SwimlaneService,
    SwimlaneStore,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
