# Contributing

## Member products

Any LibreCourseUY member can propose an independent product for `/showcase/` through a pull
request. Open source, closed-source and commercial products are welcome. Inclusion gives
members visibility; LibreCourseUY does not maintain or endorse the listed products.

1. Add your product to [`src/data/showcase.ts`](src/data/showcase.ts):

   ```ts
   {
     name: 'Your product',
     description: 'A short English description of what people can do with it.',
     creator: {
       name: 'Your public name',
       url: 'https://github.com/your-username', // Optional public profile.
     },
     url: 'https://your-product.example/',
   },
   ```

2. Link to the product's public website and describe its current functionality. Avoid claims
   about customers, usage or results that the creator has not confirmed. If you are proposing
   someone else's product, confirm the details with its creator.
3. Run `pnpm format:check` and `pnpm build`, then open a pull request explaining your connection
   to LibreCourseUY and linking to the product.

The same data supplies the homepage and `/showcase/`. Products are sorted alphabetically;
the homepage displays the first four. Placement is not a ranking or an endorsement.

Cards do not require an image. If you propose adding one, use an actual product screenshot
or an asset supplied by its creator.
