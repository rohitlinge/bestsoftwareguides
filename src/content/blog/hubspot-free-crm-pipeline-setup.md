---
title: "How to Set Up a Free HubSpot CRM Pipeline in 30 Minutes"
description: "Sign up, rename the deal stages, import contacts from a CSV, connect your inbox and build a deals dashboard on HubSpot's free CRM, with the free-plan limits that matter."
type: "how-to"
category: "crm-software"
updated: "2026-11-15"
---

**Short answer:** HubSpot's free CRM gives you **one deal pipeline** with up to 100 stages, **2 users** and **1,000 contacts**, with no time limit and no card needed. In 30 minutes you can sign up, rename the default stages and their win probabilities (Settings > Data Management > Objects > Deals > Pipelines), import contacts and deals from a CSV, connect Gmail or Outlook and your calendar, and build a dashboard. What free leaves out: extra pipelines (Starter allows 15), workflows, pipeline automation and the sales analytics reports.

Every step and limit below comes from HubSpot's Knowledge Base or pricing pages, linked in each section, checked November 15, 2026. HubSpot moves menus often; if a label looks different, follow the link for the current wording.

## What do you get on HubSpot's free CRM?

| Item | Free | Sales Hub Starter |
|---|---|---|
| Users | 2 | Paid seats |
| Contacts | 1,000 | 15 million (paid accounts) |
| Deal pipelines | 1 (the default) | Up to 15 in total |
| Stages per pipeline | Up to 100 | Up to 100 |
| Dashboards | 10, 50 reports each | 30, 50 reports each |
| Workflows and pipeline automation | No | Up to 50 workflows |
| HubSpot branding on chat, email and meetings | Yes | Removed |

Sources: [HubSpot CRM pricing](https://www.hubspot.com/pricing/crm), [Sales Hub pricing](https://www.hubspot.com/pricing/sales), [Set up pipelines](https://knowledge.hubspot.com/object-settings/set-up-and-customize-pipelines), [Technical limits](https://legal.hubspot.com/hubspot-product-and-services-catalog/technical-limits). The stage cap is from HubSpot's [developer docs](https://developers.hubspot.com/docs/api-reference/latest/crm/pipelines/guide).

## Minutes 0–5: How do I sign up?

1. Go to [hubspot.com/products/crm](https://www.hubspot.com/products/crm) and click **Get free CRM**.
2. Sign up with your name and email, a Google login or an Apple ID. You are logged in as soon as the account exists ([HubSpot: Set up your account](https://knowledge.hubspot.com/get-started/set-up-your-account)).

## Minutes 5–12: How do I set up the deal stages?

The free account comes with a default **Sales Pipeline**. Edit it rather than look for a "new pipeline" button: creating a second pipeline needs a paid plan.

1. Click the **settings icon** in the top bar. In the left sidebar, under **Data Management**, click **Objects** > **Deals**, then the **Pipelines** tab.
2. **Rename the pipeline:** click its name > **Actions** > **Rename this pipeline**.
3. **Rename a stage:** click the stage name, type the new name, then **Save** (bottom left).
4. **Add a stage:** click **+ Add stage**, enter a name, pick a **Deal probability**, then **Save**.
5. **Reorder:** drag a stage to its new place, then **Save**.

The default stages and probabilities are:

| Default stage | Probability |
|---|---|
| Appointment scheduled | 20% |
| Qualified to buy | 40% |
| Presentation scheduled | 60% |
| Decision maker bought-in | 80% |
| Contract sent | 90% |
| Closed won | 100% (won) |
| Closed lost | 0% (lost) |

Keep one **won** and one **lost** stage: HubSpot says reports need both. The probability sets the weighted amount shown on the board. To make a field required when a deal reaches a stage, hover over the stage's **Conditional logic rules** column > **Add rule**, add the property and tick **Required**. HubSpot's page lists only a permission for this, not a paid plan.

Source: [HubSpot: Set up and customize pipelines](https://knowledge.hubspot.com/object-settings/set-up-and-customize-pipelines).

## Minutes 12–20: How do I import my contacts and deals?

1. Save your spreadsheet as **.csv, .xlsx or .xls**, with **one sheet** and a header row. Use UTF-8 if names contain accented or non-Latin characters ([HubSpot: Set up your import file](https://knowledge.hubspot.com/import-and-export/set-up-your-import-file)).
2. For deals, include **Deal name**, **Pipeline** and **Deal stage** columns. The pipeline and stage names must match the ones you just set up.
3. Go to the Contacts or Deals page and click **Import** (top right), or **Data Management** > **Data Integration** > **Import data**.
4. Choose the object, upload the file, pick **Create and update**, map each column to a HubSpot property, name the import, tick the consent box and click **Finish import** ([HubSpot: Import records](https://knowledge.hubspot.com/import-and-export/import-records-for-a-single-object)).

Free accounts can import files up to **20 MB**, 50 imports and 500,000 rows a day. Remember the **1,000-contact cap** on free.

## Minutes 20–25: How do I connect my inbox and calendar?

- **Inbox:** settings icon > **General** > **Email** tab > **Connect email account** > **Connect your inbox**, then sign in to Gmail or Microsoft 365 and allow access ([HubSpot: Connect your inbox](https://knowledge.hubspot.com/connected-email/connect-your-inbox-to-hubspot)).
- **Calendar:** settings icon > **General** > **Calendar** tab > **Connect your Calendar**, choose Google or Office 365, then **Accept and connect**. Only one calendar can be connected to the meetings tool ([HubSpot: Meetings tool](https://knowledge.hubspot.com/meetings-tool/use-meetings)).
- **Second user:** settings icon > **Users & Teams** > **Add users** > **Create new**. You need Super Admin permission ([HubSpot: Add users](https://knowledge.hubspot.com/account-management/add-and-remove-users)).

## Minutes 25–30: How do I create deals and track them?

1. Go to **CRM** > **Deals** and choose **Board view** from the view dropdown.
2. Hover over a stage and click **+ Deal**, fill in the name and amount, then **Create** ([HubSpot: Create deals](https://knowledge.hubspot.com/records/create-deals)).
3. Move deals between stages on the board; to update several at once, Ctrl- or Cmd-click the cards > **Edit** ([HubSpot: Board view](https://knowledge.hubspot.com/records/manage-records-in-board-view)).
4. Save a view: click the add-view icon, set filters (for example, deal owner and stage), name it and **Publish**. Views are private until you share them ([HubSpot: Saved views](https://knowledge.hubspot.com/records/create-and-manage-saved-views)).
5. Add a dashboard: **Reporting** > **Dashboards** > **Create dashboard**, then add reports from the library ([HubSpot: Dashboards](https://knowledge.hubspot.com/dashboards/manage-your-dashboards)).

## What will make me upgrade?

- **A second pipeline**, for example one for renewals: Starter allows 15 pipelines in total.
- **Automation:** creating a task when a deal enters a stage needs Sales Hub Starter or above ([HubSpot: Automate pipelines](https://knowledge.hubspot.com/object-settings/automate-deal-pipelines)).
- **More than 2 users or 1,000 contacts.**
- **Sales reports:** the sales analytics suite needs Starter, and custom reports need Professional.

Sales Hub Starter costs $15 per seat a month on annual billing in our data. Compare it with other CRMs in our [CRM software ranking](/best/crm-software/), or read [what a CRM costs in 2026](/blog/how-much-does-a-crm-cost-2026/).
