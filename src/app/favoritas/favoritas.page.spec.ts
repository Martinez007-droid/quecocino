import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritasPage } from './favoritas.page';

describe('FavoritasPage', () => {
  let component: FavoritasPage;
  let fixture: ComponentFixture<FavoritasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
