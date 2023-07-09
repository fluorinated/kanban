import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressLaneComponent } from './in-progress-lane.component';

describe('InProgressLaneComponent', () => {
  let component: InProgressLaneComponent;
  let fixture: ComponentFixture<InProgressLaneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InProgressLaneComponent]
    });
    fixture = TestBed.createComponent(InProgressLaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
