import { tv } from 'tailwind-variants';

/** Centers page-level content at `--container-page` with the shared horizontal gutter. */
export const containerStyles = tv({
  base: 'mx-auto w-full max-w-page px-4 sm:px-5',
});
