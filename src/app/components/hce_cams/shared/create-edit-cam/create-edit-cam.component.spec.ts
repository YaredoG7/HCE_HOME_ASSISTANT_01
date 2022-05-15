import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditCamComponent } from './create-edit-cam.component';

describe('CreateEditCamComponent', () => {
  let component: CreateEditCamComponent;
  let fixture: ComponentFixture<CreateEditCamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditCamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditCamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
