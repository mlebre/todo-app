import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewList } from './modal-new-list.component';

describe('ModalNewList', () => {
  let component: ModalNewList;
  let fixture: ComponentFixture<ModalNewList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNewList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNewList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
