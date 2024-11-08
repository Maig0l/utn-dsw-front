import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { ShopService } from './components/services/shop.service.js';
import { FormsModule } from '@angular/forms';
import { confirmEqualsValidatorDirective } from './shared/equalsValidator.js';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, FormsModule),
    ShopService, confirmEqualsValidatorDirective
  ]
};
