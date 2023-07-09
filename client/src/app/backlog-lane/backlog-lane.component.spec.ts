import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklogLaneComponent } from './backlog-lane.component';

describe('BacklogLaneComponent', () => {
  let component: BacklogLaneComponent;
  let fixture: ComponentFixture<BacklogLaneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BacklogLaneComponent]
    });
    fixture = TestBed.createComponent(BacklogLaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
