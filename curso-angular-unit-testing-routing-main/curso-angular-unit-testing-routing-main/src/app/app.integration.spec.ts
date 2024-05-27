import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Router, RouterLinkWithHref } from '@angular/router';
import {
  asyncData,
  clickElement,
  getText,
  mockObservable,
  query,
  queryAllByDirective,
} from 'src/testing';
import { routes } from './app-routing.module';
import { AppModule } from './app.module';
import { ProductsService } from './services/product.service';
import { generateManyProducts } from './models/product.mock';
import { AuthService } from './services/auth.service';
import { generateOneUser } from './models/user.mock';

fdescribe('App integration Test', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;
  let productService: jasmine.SpyObj<ProductsService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getAll',
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);

    await TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule.withRoutes(routes)],
      providers: [
        { provide: ProductsService, useValue: productServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    router = TestBed.inject(Router);

    productService = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    router.initialNavigation();

    tick();

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be there 7 routerLinks', () => {
    const links = queryAllByDirective(fixture, RouterLinkWithHref);

    expect(links.length).toEqual(7);
  });

  it('should render OtherComponent', fakeAsync(() => {
    const productsMock = generateManyProducts(10);
    productService.getAll.and.returnValue(asyncData(productsMock));

    const userMock = generateOneUser();
    authService.getUser.and.returnValue(mockObservable(userMock));

    clickElement(fixture, 'others-link', true);

    tick(); // Wait for navigation
    fixture.detectChanges(); // ngOnInit

    tick(); // exec getAll
    fixture.detectChanges(); // Complete render

    expect(router.url).toEqual('/others');

    const element = query(fixture, 'app-others');

    expect(element).not.toBeNull();

    const totalProducts = getText(fixture, 'products-lenght');

    expect(totalProducts).toContain(productsMock.length);
  }));

  it('should not render OtherComponent and navigate to home', fakeAsync(() => {
    authService.getUser.and.returnValue(mockObservable(null));

    clickElement(fixture, 'others-link', true);

    tick(); // Wait for navigation
    fixture.detectChanges(); // ngOnInit

    tick(); // exec getAll
    fixture.detectChanges(); // Complete render

    expect(router.url).toEqual('/');
  }));

  it('should render OtherComponent', fakeAsync(() => {
    clickElement(fixture, 'pico-link', true);

    tick();
    fixture.detectChanges();

    expect(router.url).toEqual('/pico-preview');

    const element = query(fixture, 'app-pico-preview');

    expect(element).not.toBeNull();
  }));
});
