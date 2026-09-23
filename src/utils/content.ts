import { getCollection, type CollectionEntry } from 'astro:content';
import { sitePath } from '@utils/site-path';

/**
 * Content module for the English marketing collections (`blog`, `insights`,
 * `products`).
 *
 * Entries live under `src/content/<collection>/en/<slug>.md`. This module is
 * the only place that knows the id prefix and route served by each collection.
 */

export type LocalisedCollection = 'blog' | 'insights' | 'products';
export type LocalisedEntry<
  C extends LocalisedCollection = LocalisedCollection,
> = CollectionEntry<C>;

/** Unlocalised route prefix of each collection. */
const ROUTES: Record<LocalisedCollection, string> = {
  blog: '/blog',
  insights: '/insights',
  products: '/products',
};

/** Default ordering of each collection wherever it is listed. */
const SORTERS: {
  [C in LocalisedCollection]: (
    a: CollectionEntry<C>,
    b: CollectionEntry<C>
  ) => number;
} = {
  blog: (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  products: (a, b) => a.data.main.id - b.data.main.id,
  insights: () => 0,
};

/** The entry's id without its English directory prefix; the route param for `[id]`. */
export function slugOf(entry: LocalisedEntry): string {
  return entry.id.replace(/^[^/]+\//, '');
}

/** Base-path-aware site-relative path of an entry's page. */
export function pathFor(entry: LocalisedEntry): string {
  return sitePath(`${ROUTES[entry.collection]}/${slugOf(entry)}/`);
}

/** English entries of one collection, in that collection's order. */
export async function entriesFor<C extends LocalisedCollection>(
  collection: C
): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection, ({ id }) =>
    id.startsWith('en/')
  );
  return entries.sort(
    SORTERS[collection] as (
      a: CollectionEntry<C>,
      b: CollectionEntry<C>
    ) => number
  );
}

/** `getStaticPaths` result for a collection's English detail route. */
export async function staticPathsFor<C extends LocalisedCollection>(collection: C) {
  const entries = await entriesFor(collection);
  return entries.map(entry => ({
    params: { id: slugOf(entry) },
    props: { entry },
  }));
}
