<script context="module">
  import * as Home from './../../pages/home.md';

  export const load = async ({ fetch }) => {
    const docs = await fetch('./docs.json').then((res) => res.json());
    return {
      props: { docs, Component: Home.default, metadata: Home.metadata },
    };
  };
</script>

<script>
  import { SEO } from '@reuters-graphics/graphics-svelte-components';

  export let docs;
  export let Component;
  export let metadata;
</script>

<SEO
  seoTitle="{metadata.title}"
  seoDescription="{metadata.description}"
  shareTitle="{metadata.title}"
  shareDescription="{metadata.description}"
  shareImgPath="{'images/reuters-graphics.jpg'}"
  lang="en"
/>

<svelte:component this="{Component}" />
