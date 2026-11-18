import { posts } from '../../lib/posts';
import { postMd, md } from '../../lib/markdown';

// /blog/<slug>.md: the guide's markdown source with absolute links.
export const getStaticPaths = () => posts.map((p) => ({ params: { slug: p.slug } }));
export const GET = ({ params }: any) => md(postMd(params.slug));
