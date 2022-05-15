import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditLocksComponent } from './create-edit-locks.component';

describe('CreateEditLocksComponent', () => {
  let component: CreateEditLocksComponent;
  let fixture: ComponentFixture<CreateEditLocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditLocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditLocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
