import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import 'zone.js';  // ¡necesario para Angular!


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
