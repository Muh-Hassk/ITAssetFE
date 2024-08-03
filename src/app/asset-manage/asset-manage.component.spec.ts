import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetManageComponent } from './asset-manage.component';

describe('AssetManageComponent', () => {
  let component: AssetManageComponent;
  let fixture: ComponentFixture<AssetManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetManageComponent]
    });
    fixture = TestBed.createComponent(AssetManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
