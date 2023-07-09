import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersListComponent } from './filters-list.component';

describe('FiltersListComponent', () => {
  let component: FiltersListComponent;
  let fixture: ComponentFixture<FiltersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersListComponent]
    });
    fixture = TestBed.createComponent(FiltersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
