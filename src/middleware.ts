import { defineMiddleware } from 'astro:middleware';
import { getCopy } from '@/copy';

/** Expose the shared English copy table to every marketing page. */
export const onRequest = defineMiddleware((context, next) => {
  context.locals.copy = getCopy();
  return next();
});
