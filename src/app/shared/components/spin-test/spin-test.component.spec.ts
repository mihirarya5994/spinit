import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinTestComponent } from './spin-test.component';

describe('SpinTestComponent', () => {
  let component: SpinTestComponent;
  let fixture: ComponentFixture<SpinTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
