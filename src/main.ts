import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RouterComponent } from './app/router.component';

bootstrapApplication(RouterComponent, appConfig)
  .catch((err) => console.error(err));
