import { categories, useCases } from '../../lib/data';
import { rankingMd, md } from '../../lib/markdown';

// /best/<category>.md and /best/<use-case>.md: markdown twins of the ranking pages.
export function getStaticPaths() {
  return [
    ...categories.map((c) => ({ params: { slug: c.slug }, props: { c } })),
    ...useCases.map((u) => ({ params: { slug: u.slug }, props: { c: u.category, u } })),
  ];
}
export const GET = ({ props }: any) => md(rankingMd(props.c, props.u));
