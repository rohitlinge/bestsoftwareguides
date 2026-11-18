import { homeMd, md } from '../lib/markdown';

// /index.md: the homepage as markdown. The Worker also serves it at / to agents that ask for markdown.
export const GET = () => md(homeMd());
