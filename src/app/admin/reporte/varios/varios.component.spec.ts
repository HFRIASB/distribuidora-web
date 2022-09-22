import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariosComponent } from './varios.component';

describe('VariosComponent', () => {
  let component: VariosComponent;
  let fixture: ComponentFixture<VariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
