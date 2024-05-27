import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { queryAllByDirective, RouterLinkDirectiveStub } from 'src/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-banner',
})
class BannerComponentStub {}

@Component({
  selector: 'app-fotter',
})
class FooterComponentStub {}

fdescribe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent,
        BannerComponentStub,
        FooterComponentStub,
        RouterLinkDirectiveStub,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should be there 7 routerLinks', () => {
    const links = queryAllByDirective(fixture, RouterLinkDirectiveStub);

    expect(links.length).toEqual(7);
  });

  it('should be there 7 routerLinks matching routes', () => {
    const links = queryAllByDirective(fixture, RouterLinkDirectiveStub);

    const routerLinks = links.map((link) =>
      link.injector.get(RouterLinkDirectiveStub)
    );

    expect(links.length).toEqual(7);
    expect(routerLinks[0].linkParams).toEqual('/');
    expect(routerLinks[1].linkParams).toEqual('/auth/register');
    expect(routerLinks[2].linkParams).toEqual('/products');
    expect(routerLinks[3].linkParams).toEqual('/people');
    expect(routerLinks[4].linkParams).toEqual('/others');
    expect(routerLinks[5].linkParams).toEqual('/pico-preview');
    expect(routerLinks[6].linkParams).toEqual('/auth/login');
  });
});
