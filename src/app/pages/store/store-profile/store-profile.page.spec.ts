import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreProfilePage } from './store-profile.page';

describe('StoreProfilePage', () => {
  let component: StoreProfilePage;
  let fixture: ComponentFixture<StoreProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
