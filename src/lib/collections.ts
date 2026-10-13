import { getCollection, type CollectionKey } from 'astro:content';

// restore yaml order
export async function getOrdered<C extends CollectionKey>(name: C) {
  const entries = await getCollection(name);
  return entries.sort((a, b) => a.data.order - b.data.order);
}
