import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedNotesComponent } from './fixed-notes.component';

describe('FixedNotesComponent', () => {
  let component: FixedNotesComponent;
  let fixture: ComponentFixture<FixedNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
