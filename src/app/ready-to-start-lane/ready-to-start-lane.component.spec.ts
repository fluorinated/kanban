import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyToStartLaneComponent } from './ready-to-start-lane.component';

describe('ReadyToStartLaneComponent', () => {
  let component: ReadyToStartLaneComponent;
  let fixture: ComponentFixture<ReadyToStartLaneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadyToStartLaneComponent]
    });
    fixture = TestBed.createComponent(ReadyToStartLaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
