// Review form options and limits, shared by the Worker (validation) and the site (form + guidelines).
export const RELATIONSHIPS = { user: 'Customer or user', vendor: 'Works for this vendor', competitor: 'Works for a competitor', other: 'Other connection' };
export const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-1,000', '1,001-5,000', '5,000+'];
export const USAGE = ['Less than 6 months', '6-12 months', '1-2 years', 'More than 2 years'];
export const LIMITS = { title: [5, 100], pros: [20, 1500], cons: [20, 1500], role: [0, 80] };
export const DAILY_LIMIT = 5;
// Published on /review-guidelines/. A negative opinion is never a reason to reject.
export const REJECT_REASONS = {
  spam: 'Spam, advertising or links',
  'not-first-hand': 'Not based on first-hand use of the product',
  abuse: 'Abusive, hateful or a personal attack',
  private: 'Shares private or confidential information',
  duplicate: 'Duplicate or copied text',
  'off-topic': 'Not about this product',
  undisclosed: 'Conflict of interest not disclosed',
};
