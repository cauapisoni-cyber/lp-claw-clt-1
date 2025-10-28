// src/main.server.ts
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(AppComponent, {
    ...config,
    providers: [
      provideHttpClient(),
      ...(config.providers || [])
    ]
  }, context);

export default bootstrap;
