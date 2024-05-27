import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ProductDetailComponent } from './product-detail.component';
import { ActivatedRoute } from '@angular/router';
import {
  ActivatedRouteStub,
  asyncData,
  getText,
  mockObservable,
} from 'src/testing';
import { ProductsService } from 'src/app/services/product.service';
import { Location } from '@angular/common';
import { generateOneProduct } from 'src/app/models/product.mock';

fdescribe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let route: ActivatedRouteStub;
  let productsService: jasmine.SpyObj<ProductsService>;
  let location: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    const routeStub = new ActivatedRouteStub();
    const productServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getOne',
    ]);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      declarations: [ProductDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: ProductsService, useValue: productServiceSpy },
        { provide: Location, useValue: locationSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute) as unknown as ActivatedRouteStub;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    productsService = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;
  });

  it('should create', () => {
    const productId = '1';
    route.setParamMap({ id: productId });

    const productMock = { ...generateOneProduct(), id: productId };

    productsService.getOne.and.returnValue(mockObservable(productMock));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should show the product', fakeAsync(() => {
    const productId = '2';
    route.setParamMap({ id: productId });

    const productMock = { ...generateOneProduct(), id: productId };

    productsService.getOne.and.returnValue(asyncData(productMock));

    fixture.detectChanges();

    expect(component.status).toEqual('loading');

    tick();
    fixture.detectChanges();

    const titleText = getText(fixture, 'title');
    const priceText = getText(fixture, 'price');

    expect(titleText).toContain(productMock.title);
    expect(priceText).toContain(productMock.price);
    expect(productsService.getOne).toHaveBeenCalledWith(productId);
    expect(component.status).toEqual('success');
  }));

  it('should show go back without id param', () => {
    route.setParamMap({});

    location.back.and.callThrough();

    fixture.detectChanges();

    expect(location.back).toHaveBeenCalled();
  });

  it('should get the qyery param type', () => {
    const productId = '2';
    route.setParamMap({ id: productId });
    route.setQueryParamMap({ type: 'customer' });

    const productMock = { ...generateOneProduct(), id: productId };

    productsService.getOne.and.returnValue(mockObservable(productMock));

    fixture.detectChanges();

    expect(component.customerType).toEqual('customer');
  });
});
