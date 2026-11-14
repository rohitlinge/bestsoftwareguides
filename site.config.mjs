// Central site settings. Edit these before you deploy.
export default {
  name: 'BestSoftwareGuides',
  domain: 'bestsoftwareguides.online',
  url: 'https://bestsoftwareguides.online',
  tagline: 'Software pricing and comparisons, sourced from vendor pages and dated.',
  description:
    'Independent software directory: ranked lists, pricing breakdowns and head-to-head comparisons, with every price linked to the vendor page and the date it was checked.',
  contactEmail: 'hello@bestsoftwareguides.online',
  // Put a real, named person here as soon as you can. Named authors are a strong trust signal.
  // When you do: set type to 'Person', fill jobTitle and bio, and add profile URLs
  // (LinkedIn, X, GitHub) to sameAs. They go into the Person schema on every article.
  editor: {
    type: 'Organization', // 'Person' once a real editor is named
    name: 'BestSoftwareGuides Editorial Team',
    url: '/about/',
    jobTitle: '',
    bio: '',
    sameAs: [],
  },
  // Organization profiles (X, LinkedIn page, GitHub). Used in Organization schema.
  sameAs: [],
  // Search-console verification codes (the content="" value only). Leave empty if you verify by DNS.
  verification: { bing: 'B44B109BD1960C9727A4D8506739AE85', google: '' },

  // ---- Drip-publishing ----
  // Day 0 of the content plan. Every item in src/data/schedule.json is published
  // on launchDate + its "day" offset. The daily GitHub Action rebuilds the site,
  // so new pages go live automatically on their day.
  // Override at build time with the LAUNCH_DATE env var (YYYY-MM-DD).
  launchDate: '2026-11-14',

  // Pages whose data is older than this are marked noindex until re-checked.
  maxDataAgeDays: 120,

  // IndexNow key (also stored in public/<key>.txt)
  indexNowKey: '1ac3c2b52c1f3554a28994e63cc6d604',
};
