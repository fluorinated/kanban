import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardsListComponent } from './boards-list.component';

describe('BoardsListComponent', () => {
  let component: BoardsListComponent;
  let fixture: ComponentFixture<BoardsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardsListComponent]
    });
    fixture = TestBed.createComponent(BoardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
