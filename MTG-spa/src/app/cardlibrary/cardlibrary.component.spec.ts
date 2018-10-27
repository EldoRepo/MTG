import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardlibraryComponent } from './cardlibrary.component';

describe('CardlibraryComponent', () => {
  let component: CardlibraryComponent;
  let fixture: ComponentFixture<CardlibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardlibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardlibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
