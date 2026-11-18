// WebMCP: registers read-only site tools for AI agents running in the browser (W3C Web Machine
// Learning Community Group draft). Each tool wraps the public REST API (/api/v1, spec at
// /openapi.json), so an agent gets structured data instead of scraping the page.
// Does nothing in browsers without WebMCP.
(() => {
  const mc = (typeof document !== 'undefined' && document.modelContext) || (typeof navigator !== 'undefined' && navigator.modelContext);
  if (!mc || typeof mc.registerTool !== 'function') return;

  const api = async (path) => {
    const res = await fetch(path, { headers: { Accept: 'application/json' } });
    const body = await res.json().catch(() => ({ error: { message: `HTTP ${res.status}` } }));
    return { content: [{ type: 'text', text: JSON.stringify(body) }], structuredContent: body, isError: !res.ok };
  };
  const enc = encodeURIComponent;
  const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

  const tools = [
    {
      name: 'search_software',
      description: 'Search BestSoftwareGuides for software, category rankings, comparisons and guides by keyword (a product name, category or topic). Use first when you only have a name; returns slugs and page URLs for the other tools.',
      inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'Keywords, e.g. "password manager" or "langfuse"' }, limit: { type: 'integer', minimum: 1, maximum: 25, description: 'Maximum results (default 10)' } }, required: ['query'] },
      execute: ({ query, limit }) => api(`/api/v1/search?q=${enc(query)}${limit ? `&limit=${enc(limit)}` : ''}`),
    },
    {
      name: 'get_ranking',
      description: 'Get the ranked list of tools for a software category or use case, with score out of 10, entry price, free plan and who each tool suits. Use to answer "what is the best X". Optional filters: free plan only, maximum annual entry price.',
      inputSchema: { type: 'object', properties: { category: { type: 'string', description: 'Category or use-case slug or name, e.g. "crm-software" or "mcp gateways"' }, free_plan: { type: 'boolean', description: 'Only tools with a permanent free plan' }, max_price: { type: 'number', description: 'Maximum entry price in USD per month, billed annually' } }, required: ['category'] },
      execute: ({ category, free_plan, max_price }) => api(`/api/v1/rankings/${enc(category)}?${free_plan ? 'free_plan=true&' : ''}${max_price != null ? `max_price=${enc(max_price)}` : ''}`),
    },
    {
      name: 'get_tool',
      description: 'Get the fact sheet for one software product: what it is, who it suits, rank and score in each category, free plan, trial, platforms, features, pros and cons, and the date the facts were checked.',
      inputSchema: { type: 'object', properties: { tool: { type: 'string', description: 'Tool slug or name, e.g. "grammarly"' } }, required: ['tool'] },
      execute: ({ tool }) => api(`/api/v1/tools/${enc(tool)}`),
    },
    {
      name: 'get_tool_pricing',
      description: 'Get every pricing plan for one software product: monthly and annual prices in USD, plan notes and limits, free plan details, trial, the vendor pricing URL and the date checked. Use to answer "how much does X cost".',
      inputSchema: { type: 'object', properties: { tool: { type: 'string', description: 'Tool slug or name, e.g. "langfuse"' } }, required: ['tool'] },
      execute: ({ tool }) => api(`/api/v1/tools/${enc(tool)}/pricing`),
    },
    {
      name: 'compare_tools',
      description: 'Compare two software products side by side: scores and ranks where they share a category, free plan, entry prices, trial, platforms, features, pros and cons. Use to answer "X vs Y".',
      inputSchema: { type: 'object', properties: { tool_a: { type: 'string', description: 'First tool slug or name' }, tool_b: { type: 'string', description: 'Second tool slug or name' } }, required: ['tool_a', 'tool_b'] },
      execute: ({ tool_a, tool_b }) => api(`/api/v1/compare?a=${enc(tool_a)}&b=${enc(tool_b)}`),
    },
  ];

  for (const t of tools) {
    try { mc.registerTool({ ...t, annotations: READ_ONLY }); } catch (e) { console.warn('WebMCP registerTool failed:', t.name, e); }
  }
})();
