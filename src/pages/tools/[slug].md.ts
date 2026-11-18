import { tools } from '../../lib/data';
import { toolMd, md } from '../../lib/markdown';

// /tools/<tool>.md: markdown twin of a tool page, with every pricing plan.
export const getStaticPaths = () => tools.map((t) => ({ params: { slug: t.slug }, props: { t } }));
export const GET = ({ props }: any) => md(toolMd(props.t));
