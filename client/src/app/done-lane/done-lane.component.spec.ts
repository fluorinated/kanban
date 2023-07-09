import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneLaneComponent } from './done-lane.component';

describe('DoneLaneComponent', () => {
  let component: DoneLaneComponent;
  let fixture: ComponentFixture<DoneLaneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoneLaneComponent]
    });
    fixture = TestBed.createComponent(DoneLaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
