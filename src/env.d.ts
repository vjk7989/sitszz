/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** English marketing copy set by `src/middleware.ts`. */
    copy: import('@/copy').Copy;
  }
}
