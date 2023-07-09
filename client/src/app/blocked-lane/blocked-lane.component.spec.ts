import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedLaneComponent } from './blocked-lane.component';

describe('BlockedLaneComponent', () => {
  let component: BlockedLaneComponent;
  let fixture: ComponentFixture<BlockedLaneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockedLaneComponent]
    });
    fixture = TestBed.createComponent(BlockedLaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
