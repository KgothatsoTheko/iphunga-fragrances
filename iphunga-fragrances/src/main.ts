import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  ...appConfig, // Merge appConfig here
  providers: [
    provideHttpClient(),
    ...(appConfig.providers || []) // Ensure other providers from appConfig are included
  ]
}).catch((err) => console.error(err));
