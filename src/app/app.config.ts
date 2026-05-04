import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MARKED_OPTIONS, MarkedRenderer, provideMarkdown } from 'ngx-markdown';

import { routes } from './app.routes';

const renderer = new MarkedRenderer();

renderer.image = ({ href, text }) => {
  if (href.endsWith('.mp4') || href.endsWith('.webm')) {
    return `<video autoplay loop muted playsinline class="mx-auto">
              <source src="${href}" type="video/${href.split('.').pop()}">
            </video>`;
  }
  return `<img src="${href}" alt="${text}">`;
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: { renderer }
      }
    }),
  ]
};
