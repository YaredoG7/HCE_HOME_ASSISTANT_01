import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditLightsComponent } from './create-edit-lights.component';

describe('CreateEditLightsComponent', () => {
  let component: CreateEditLightsComponent;
  let fixture: ComponentFixture<CreateEditLightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditLightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditLightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
