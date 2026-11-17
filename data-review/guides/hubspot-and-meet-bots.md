# Research notes: HubSpot free CRM pipeline guide and Fireflies/Otter Google Meet bot guide

Gathered 2026-11-15. Every bullet is from a vendor's own help, docs or pricing page, with its URL. Anything that is not confirmed by an official page is marked **UNCONFIRMED**. Wording in quotes is copied from the page.

Notes on sourcing:
- help.otter.ai refuses automated fetches (HTTP 403), so the Otter pages were read in a real browser. Google Workspace admin help has moved from support.google.com/a/... to knowledge.workspace.google.com/admin/... (support.google.com/a/answer/7304109 now gives a 301 redirect there).

---

## GUIDE 1: Set up a free HubSpot CRM pipeline in 30 minutes

### Sign-up and what the free tier includes

- Sign-up URL is https://app.hubspot.com/signup-hubspot/crm. The CRM product page button reads "Get free CRM" and says no card is needed. Source: https://www.hubspot.com/products/crm
- Ways to sign up: name and email address (the most common), a Google login, or an Apple ID. You are "automatically be logged in" once the account is created. Source: https://knowledge.hubspot.com/get-started/set-up-your-account
- The free CRM product page says: "With up to two users, 1,000 contacts, and no limits on customer data". It also says the free tier has no expiration date. Source: https://www.hubspot.com/products/crm
- Pricing FAQ: "You can add up to 2 users to your free account." Source: https://www.hubspot.com/pricing/crm
- HubSpot's technical limits list contacts as "1,000 (free accounts), 15 million (paid accounts)". Source: https://legal.hubspot.com/hubspot-product-and-services-catalog/technical-limits
- **Deal pipelines.** Free tools get **0 custom pipelines**, Starter gets 15, Professional 100 and Enterprise 350 (seat-based pricing). Under Flexible Seats & Credits pricing the figures are 0 / 15 / 350 / 350. Custom pipelines "exclude the default pipeline", so a free account has only the one default deal pipeline. Custom pipelines are shared across all objects. Creating a custom pipeline requires Starter, Professional or Enterprise. Source: https://knowledge.hubspot.com/object-settings/set-up-and-customize-pipelines
- Starter pricing page: "Up to 15 total pipelines per account across object types". The Free column for deal pipelines is blank. Sources: https://www.hubspot.com/pricing/crm and https://www.hubspot.com/pricing/sales
- To check pipeline usage, go to Data Management > Data Model, open the Limits tab, then click Pipelines under Definition Limits. Source: https://knowledge.hubspot.com/object-settings/set-up-and-customize-pipelines
- **Deal stages limit.** "Deal, ticket, and custom object pipelines can have up to 100 stages." Source: https://developers.hubspot.com/docs/api-reference/latest/crm/pipelines/guide (this is a developer docs page; the Knowledge Base gives no stage cap).
- **Custom properties limit: UNCONFIRMED.** The KB article says only that "the number of custom properties you can create depends on your HubSpot subscription". The pricing pages, the product catalog and the technical limits page give no number. The "10 custom properties on free" figure seen around the web comes from third-party blogs and community posts only. Source: https://knowledge.hubspot.com/properties/create-and-edit-properties
- After a downgrade to free tools, you "can view and edit existing custom properties but cannot create new properties if you already exceed the limit." Source: https://knowledge.hubspot.com/properties/create-and-edit-properties
- Dashboards and reports: Free gets "10 dashboards, 50 reports per dashboard". Starter gets "30 dashboards, 50 reports per dashboard". Sources: https://www.hubspot.com/pricing/crm and https://www.hubspot.com/pricing/sales
- HubSpot branding: Free includes HubSpot branding on features such as live chat, 1-to-1 email and meetings (the meetings entry reads "Includes HubSpot branding"). Starter removes it. Sources: https://www.hubspot.com/pricing/crm and https://www.hubspot.com/pricing/sales
- Automation: the Free column for workflows is blank. Starter gets "Up to 50 workflows with restricted triggers and actions". Source: https://www.hubspot.com/pricing/sales
- Pipeline automations (for example, create a task when a deal enters a stage) are "Available with any of the following subscriptions": Sales Hub or Service Hub Starter, Professional or Enterprise. So they are **not on free**. Source: https://knowledge.hubspot.com/object-settings/automate-deal-pipelines

### Edit the default sales pipeline (Settings > Objects > Deals > Pipelines)

- Path: click the settings icon in the top navigation bar. In the left sidebar under Data Management, open Objects, choose Deals, then open the Pipelines tab. Pipeline editing is available on "All products and plans". It needs the "Edit property settings" permission. Source: https://knowledge.hubspot.com/object-settings/set-up-and-customize-pipelines
- Default Sales Pipeline stages and probabilities: Appointment scheduled 20%, Qualified to buy 40%, Presentation scheduled 60%, Decision maker bought-in 80%, Contract sent 90%, Closed won 100% (Won), Closed lost 0% (Lost). Source: https://knowledge.hubspot.com/object-settings/set-up-and-customize-pipelines
- Rename the pipeline: click the pipeline's name, then Actions > Rename this pipeline. Source: same as above.
- Rename a stage: click the stage name, type the new name, then click Save in the bottom left. Source: same as above.
- Add a stage: click + Add stage below the existing stages, enter a name, choose a value from the Deal probability dropdown (for a custom value, type it, click Add option and select it), then click Save. Source: same as above.
- Reorder stages: drag the stage to its new position, then click Save. Source: same as above.
- Win probability: "Stage probability is used to determine the weighted amount shown in board view." Won is 100% and Lost is 0%. "you must include stages for both Won and Lost" so that reports process deals correctly. Source: same as above.
- Delete a stage: first check the "Used in" column and clear anything that blocks deletion (records, conditional properties). Then click the delete icon in the Delete column. You "can't delete a pipeline if it contains records or is used in other HubSpot tools or integrations." Source: same as above.
- Required properties per stage (conditional stage properties):
  1. In the stage row, hover over the Conditional logic rules column and click Add rule.
  2. Choose an operator.
  3. Under Dependent properties, click Add property.
  4. Optionally tick Required.
  5. Click Save logic.

  The page gives only a permission requirement (Edit property settings) and no subscription requirement, so this appears to be on free. Read-only properties "cannot be used as stage properties." Source: https://knowledge.hubspot.com/object-settings/set-up-and-customize-pipelines. **Not tested on a free account.**
- Create a custom deal property: settings icon > Properties > Select an object > Deal properties > Create property. Enter a label and field type, then click Create property. Source: https://knowledge.hubspot.com/properties/create-and-edit-properties

### Create a deal and move deals on the board

- Create a deal from board view:
  1. Go to CRM > Deals (click More first if your account shows it).
  2. From the view type dropdown, choose Board view.
  3. Hover over a stage and click + Deal.
  4. Fill in the properties. Pipeline and Deal stage are filled in for you.
  5. Click Create.

  Available on "All products and plans". Source: https://knowledge.hubspot.com/records/create-deals
- Board view: "objects with pipelines also have a board view, where records are shown as cards moving through stages in a pipeline". The article lists "Edit and move records between pipeline stages." Board view is on "All products and plans". Source: https://knowledge.hubspot.com/records/manage-records-in-board-view
- **The drag-a-card-to-another-stage gesture: UNCONFIRMED in wording.** The board view article never describes dragging a card between stage columns. It documents only dragging cards up and down within a lane (manual sort) and bulk edits. Source: https://knowledge.hubspot.com/records/manage-records-in-board-view
- Bulk edit on the board:
  1. Hold Cmd or Ctrl and click cards, or click Select all.
  2. Click Edit.
  3. Choose the property to update, set the value, then click Update.

  Source: same as above.
- "A Starter, Professional, or Enterprise subscription is required to move a record to a different pipeline." This does not matter on free, which has only one pipeline. Source: same as above.

### Import contacts and deals from a CSV

- Path: More > Data Management > Data Integration > Import data > Advanced imports (all objects). You can also click Import in the upper right of any object index page. Then:
  1. Select the object and click Next.
  2. Choose a file, or paste directly from your spreadsheet.
  3. Choose the mode (Create and update / Create new only / Update existing only).
  4. Map the unique identifier, then map each column (or skip it, or choose "Don't overwrite").
  5. Name the import and tick the consent box.
  6. Click Finish import.

  Available on all plans. It needs Import and Edit permissions for the object. Source: https://knowledge.hubspot.com/import-and-export/import-records-for-a-single-object
- File rules:
  - The file must be .csv, .xlsx or .xls and must "Contain only one sheet".
  - It needs a header row whose columns match HubSpot properties, in any order.
  - It must have fewer than 1,000 columns.
  - Use UTF-8 if the file contains foreign-language characters.

  Source: https://knowledge.hubspot.com/import-and-export/set-up-your-import-file
- Free tools limits: 20 MB maximum file size, 50 imports per day and 500,000 rows per day. Paid plans get 512 MB, 500 imports per day and 10,000,000 rows per day. Up to 3 imports can run at once (2 if over 10,000 rows). Limits apply to a rolling 24 hours. Source: https://knowledge.hubspot.com/import-and-export/set-up-your-import-file
- New deals need Deal name, Pipeline and Deal stage. "Pipeline and Deal stage must match existing options in your account." Source: same as above.
- To update existing records, include a unique identifier: Record ID, a unique-value custom property, Email (contacts) or Company domain name (companies). Source: same as above.

### Connect inbox and calendar (free)

- Inbox: settings icon > General > Email tab > Connect email account > Connect your inbox. Enter your email, then click Connect to [provider]. For Gmail, sign in and click Allow; for Outlook, sign in to Microsoft 365. Available on "All products and plans". It needs the Personal email access permission. View-Only seat users "cannot connect their individual work emails". Source: https://knowledge.hubspot.com/connected-email/connect-your-inbox-to-hubspot
- Calendar: settings icon > General > Calendar tab > Connect your Calendar. Choose Google / Gmail or Office 365, then click Accept and connect. Available on "All products and plans". Only one calendar can be connected to the meetings tool. You must have "Personal email access turned on in your settings". Source: https://knowledge.hubspot.com/meetings-tool/use-meetings

### Add users and seat types

- Path: settings icon > Users & Teams > Add users > Create new.
  1. Enter the email(s).
  2. Select seats, permissions and teams.
  3. Optionally tick Send email invites, then click Add user(s) and Done.

  "Super Admin permissions are required to create new users". Source: https://knowledge.hubspot.com/account-management/add-and-remove-users
- Seats: "If you're upgrading from HubSpot free tools to a Starter subscription, free seats are removed once you upgrade." Starter has Core Seats and View-Only Seats. View-Only Seats are "free and unlimited for Starter, Professional, and Enterprise subscriptions". Source: https://knowledge.hubspot.com/account-management/manage-seats
- **The seat type a free-tools user gets: UNCONFIRMED.** The KB names "free seats" but does not describe them. The 2-user cap comes from the pricing pages above.

### Saved view "My open deals"

- Steps:
  1. On the Deals index, click the add view icon and choose a view type (table, board, etc.).
  2. Name the view and set filters (advanced or quick filters).
  3. Click Publish.

  Views are private by default. Share them through configure view > Manage sharing (Private / Team / Everyone / Custom). Available on "All products and plans". Source: https://knowledge.hubspot.com/records/create-and-manage-saved-views
- **The exact filter combination for "my open deals" (Deal owner is me, stage not Closed won/lost): UNCONFIRMED.** No KB page spells out these filters. The saved-views article shows the general steps only.

### Deals dashboard and report on free

- Create a dashboard: More > Reporting > Dashboards > Create dashboard. Pick a template (BETA) or New Dashboard, name it, set access, then click Create dashboard. Available on "All products and plans". Source: https://knowledge.hubspot.com/dashboards/manage-your-dashboards
- Add a library report: More > Reporting > Reports > Create report. Pick a template, save it, then add it to an existing or new dashboard and click Save & add. Customising filters needs Professional or Enterprise. Source: https://knowledge.hubspot.com/reports/use-a-report-from-the-report-library
- **Which deal report templates exist on free, and whether that article covers free tools: UNCONFIRMED.** The page does not list its subscriptions in readable text.
- Not on free:
  - The sales analytics suite (deal reports) needs Sales Hub Starter, Professional or Enterprise. Source: https://knowledge.hubspot.com/reports/create-sales-reports-in-the-sales-analytics-suite
  - Custom single-object reports need Professional or Enterprise. Source: https://knowledge.hubspot.com/reports/create-custom-single-object-reports
  - The custom report builder needs Professional or Enterprise. Source: https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder

---

## GUIDE 2: Fix Fireflies or Otter bot not joining Google Meet

### Google Meet settings that admit or block bots (host side)

- Host controls path:
  - **Before the meeting:** in the Calendar event, next to "Join with Google Meet", click Video call options > Host controls and scroll to "Meeting access".
  - **During the meeting:** at the bottom right, click Host controls and scroll to "Meeting access".

  Source: https://support.google.com/meet/answer/9302870?hl=en&co=GENIE.Platform%3DDesktop
- Access types (official wording):
  - Open: "Anyone with a meeting link can join your meetings. No one has to knock."
  - Trusted: "Anyone within the host's organization can join without knocking. Anyone outside the organization, but invited through a Google Calendar event, can join without knocking. Everybody else must knock."
  - Restricted: "Anyone invited through a Google Calendar event or from within the meeting by a host can join. Everyone else must knock. Not available for consumer users."

  Source: same as above.
- **Key line:** "Anonymous users or third-party bots, like note takers, that try to use "Ask to join" are automatically denied access without any action from the host." Source: https://support.google.com/meet/answer/9302870?hl=en&co=GENIE.Platform%3DDesktop
  - My inference, not stated by Google: a bot that has to knock under Trusted or Restricted access may be auto-denied. Inviting the bot's address to the Calendar event, or using Open access, avoids the knock.
  - This **conflicts** with Fireflies and Otter, which both describe the host admitting their bot from the waiting room. Flag it in the article.
- "Host must join before anyone else": "If you need to join a meeting before the participants, turn on Host must join before anyone else. Workspace users with access to the Google Meet waiting room feature won't find this option." Source: same as above.
- Default access:
  - Enterprise: "All new meetings are set to "Trusted" and by default, your guests can join before you."
  - Education: Classroom meetings are "Restricted" and guests can't join before you.
  - Consumer: Trusted. "Anyone invited through Google Calendar invite is considered "Trusted.""

  Source: same as above.
- "In-domain users who are not added to the calendar event need to knock when the access type of meeting is "Restricted"". Source: same as above.
- Admitting people: when a request appears, click Admit or Deny entry (or View all > Admit all). "Only the meeting organizer can find or approve requests to join a meeting." Source: https://support.google.com/meet/answer/9303164?hl=en&co=GENIE.Platform%3DDesktop
- Learning Center summary of who joins without knocking for each access type. Before a meeting, change access in the Calendar event's "Video call options"; during a meeting, use "Host controls". Source: https://support.google.com/a/users/answer/12172260

### Google Workspace admin settings (external / not-signed-in participants)

- Path: Admin console > Menu > Apps > Google Workspace > Google Meet > Meet safety settings. This needs the Google Meet administrator privilege. Changes "can take up to 24 hours". Source: https://knowledge.workspace.google.com/admin/meet/manage-meet-settings?hl=en
- Settings and their official descriptions:
  - Domain: "Choose an option to specify who can join meetings created by your organization."
  - Access: "Choose an option to specify the meetings users in your organization can join."
  - Joining: "You decide whether the host must join first and who needs to ask permission to join."
  - Access Type: sets the default meeting access type.
  - Waiting Rooms
  - Warn for external participants: participants are marked External.

  Source: same as above.
- Admin default for host-first: Meet safety settings > Joining (or Access Type) > tick or untick "Host must join before anyone else can join". Source: https://knowledge.workspace.google.com/admin/meet/manage-meeting-access-settings-for-your-users
- Waiting room (admin): Meet safety settings > Waiting Rooms > tick Waiting room (and optionally Bring in automatically). Editions: Business Standard/Plus, Enterprise Standard/Plus, Teaching and Learning Upgrade and others. It is "currently rolling out". Source: https://knowledge.workspace.google.com/admin/meet/manage-waiting-room-settings-for-your-users
- Option values for the not-signed-in setting, from Google's June 16, 2021 Workspace Updates post: "Only users from your organization or users dialing in using a phone" / "Users signed in with a Google account or dialing in using a phone" / "All users, including those not signed in with a Google account". Source: https://workspaceupdates.googleblog.com/2021/06/additional-admin-controls-for-joining-google-meet-calls.html
  - **The current console labels: UNCONFIRMED.** The current admin help page does not list the option values. The 2021 post's grouping of these values under "Domain" vs "Access" is ambiguous.
- Fireflies' version of the same setting: Admin Console > Apps > Google Workspace > Google Meet > Meet Safety Settings > Domain, then under Access Settings select "All users (including users not signed in with a Google account)". "Fireflies joins Google Meet as a guest, so this must be enabled." Source: https://guide.fireflies.ai/articles/7581948912-how-to-invite-fireflies-to-google-meet-meetings
- Otter: "Verify that your Google Workspace admin policy does not restrict external bots or apps from joining Meet sessions. Check Google Admin Console → Apps → Google Workspace → Meet if Notetaker fails to join." "No additional Google-side recording configuration is required for Notetaker to join." Source: https://help.otter.ai/hc/en-us/articles/39339238308503-Recording-Permissions-with-Otter

### Fireflies: documented reasons the bot doesn't join, and fixes

- Check the status first: Notifications (bell icon, top right) > Status tab (with a Filter). The statuses are:
  - Completed "Joined on behalf of"
  - Denied Entry (host or participant rejected Fred)
  - In Waiting Room / Not allowed in (not admitted)
  - Connection Failed (link, platform settings or integration)
  - "Meeting requires sign-in" (login, password, encryption, CAPTCHA or domain restrictions)
  - Meeting was too short (under 3 minutes)
  - Could not be processed

  Source: https://guide.fireflies.ai/articles/4708529470-why-fred-did-not-join-your-meeting-troubleshooting-guide
- Calendar not connected, or no valid link: Fred won't join if the calendar isn't connected, the invite lacks a valid Zoom, Teams or Meet URL, or the invite was sent after the meeting started. Use the email address connected to Fireflies when you create events, and add Fred or enable Auto-Join before the meeting begins. Source: same as above.
- Auto-join: Home > Settings > Auto-join calendar meetings toggle. The options are "All meetings with web-conf link", "Only meetings that I own", "Only meetings with teammates" and "Only when I invite fred@fireflies.ai". If "Only meetings I own" is set and you are only a participant, Fred may not join. Sources: https://guide.fireflies.ai/articles/4708529470-why-fred-did-not-join-your-meeting-troubleshooting-guide and https://guide.fireflies.ai/articles/5074225515-fix-fireflies-auto-join-settings
- There is an alternative path: Settings > Recording & Privacy (Personal tab) > Auto-record meetings. Source: https://guide.fireflies.ai/articles/5074225515-fix-fireflies-auto-join-settings
- Meeting/Recording Rules "override Auto-Join even when it's on". Bar Rules can block meetings by keyword or domain; Join Rules can restrict joins to certain keywords or domains. Source: https://guide.fireflies.ai/articles/4708529470-why-fred-did-not-join-your-meeting-troubleshooting-guide
- Host must admit, and the Google Meet "potential risk" label: if there is no Admit button, open the Participants panel, find "With potential risks", click ⋮ next to Fireflies Notetaker, then choose "Admit entry". Fireflies says the label is a Google Meet security update and "does not indicate any risk". Sources: https://guide.fireflies.ai/articles/4708529470-why-fred-did-not-join-your-meeting-troubleshooting-guide and https://guide.fireflies.ai/articles/7581948912-how-to-invite-fireflies-to-google-meet-meetings
- Fireflies waits in the lobby "up to 10 minutes for google meet" (15 minutes for other platforms) before it leaves. Source: https://guide.fireflies.ai/articles/9554534786
- It "will attempt to join exactly at the same time your meeting starts". "If the meeting starts much later, re-add it manually via Add to Live Meeting." Source: same as above.
- Bot name is "Fireflies.ai Notetaker". Renaming is paid ("$5/month for shared name across 5 users" or "$5/month/user"). Source: same as above.
- Host's organisation blocks guests: if you're not the host, the host org's Meet settings must also allow guests. Test this by opening the link in Incognito without signing in: "If they're blocked there, Fireflies will be blocked too". If so, ask the host's IT to allow guest access. Source: https://guide.fireflies.ai/articles/7581948912-how-to-invite-fireflies-to-google-meet-meetings
- Other causes Fireflies lists:
  - Someone removed Fred manually
  - Fred left before 3 minutes
  - An Outlook profile mismatch
  - Onboarding not finished (finish it at app.fireflies.ai/setup)

  Source: https://guide.fireflies.ai/articles/4708529470-why-fred-did-not-join-your-meeting-troubleshooting-guide
- Free plan limits:
  - Transcription credits depend on how you signed up: 3 (website bot), 5 (Chrome extension), 10 (new mobile user) or 5 (existing mobile user).
  - "Auto-join allows unlimited transcriptions on the Free plan".
  - Storage is 400 minutes per seat; "If you hit the limit, delete older files to store new ones."
  - 20 AI credits per month.
  - The page also says "3 meetings are included on the Free plan" without explaining how that squares with unlimited auto-join.

  Source: https://guide.fireflies.ai/articles/4027724828-learn-about-the-fireflies-free-plan
- Storage: Free 400 mins, Pro 8,000 mins, Business/Enterprise unlimited. Live Notetaker meetings have no rate limit. Source: https://guide.fireflies.ai/articles/2631950139-learn-about-transcription-credits-storage-and-rate-limits-for-meetings
- **Whether Fireflies stops joining once free credits or storage run out: UNCONFIRMED.** No page says so.
- **Multiple bots or teammates' Fireflies bots joining the same meeting (Fireflies): UNCONFIRMED.** Not covered in any Fireflies page I read.
- **Meeting language or region as a cause of a failed join (Fireflies): UNCONFIRMED.** It is not listed as a cause. Language is only a field when you add the bot to a live meeting.

### Fireflies: add the bot to a running Meet call

- Steps:
  1. Click Capture (top right), or open its dropdown, and choose "Add to live meeting".
  2. Paste the Meeting link. Optionally name the meeting, and select the Meeting language.
  3. Click "Start capture" and wait about 30 seconds to 2 minutes.
  4. Admit the bot. On Meet, the host must admit it (use ⋮ > "Admit entry" if no Admit button shows).

  You don't need to be the host. Source: https://guide.fireflies.ai/articles/9977523795-how-to-add-fireflies-to-an-ongoing-meeting
- The FAQ page words the button as "Start Capturing". Source: https://guide.fireflies.ai/articles/9554534786

### Otter: documented reasons Notetaker doesn't join, and fixes

- Find the error: on the homepage calendar, the event may show an error. If not, click the event > Open Conversation and read the Notetaker message. Source: https://help.otter.ai/hc/en-us/articles/14149727495831-Troubleshooting-Notetaker
- "Your Notetaker waited for the host to start the meeting, but it was not started": if participants can't join until the host does, Notetaker "will wait up to 5 minutes and try up to four times before leaving". Ask the host to allow participants to join before the host; for Google, Otter links to https://support.google.com/meet/answer/9303164. If the host joins later, add Notetaker manually. Source: https://help.otter.ai/hc/en-us/articles/14149727495831-Troubleshooting-Notetaker
- Waiting room not admitted: Notetaker keeps trying "for about 12 minutes" and then leaves. Otter recommends "Allow participants to join before host" and "Turn off waiting room". Source: same as above.
- You can notify the host 24 hours in advance from Account Settings > Meetings. Source: same as above.
- Host removed it, or denied it from the waiting room: ask the host to allow Notetaker. Source: same as above.
- "Join URL requires user to sign into conferencing app": "The meeting must allow external guests for Notetaker to successfully join." Source: same as above.
- Guests must be allowed: "Your meeting and organization settings must allow guest participants for Notetaker to join." Notetaker "cannot sign in to an account belonging to your organization to bypass guest restrictions." Source: https://help.otter.ai/hc/en-us/articles/4425393298327-Otter-Notetaker-Overview
- "Conferencing URL is not valid": only Zoom, Google Meet and Teams links work. Supported events show the platform icon, Join meeting and a Notetaker toggle. Test the link in an incognito window, and use Google Calendar's built-in Meet scheduler. Source: https://help.otter.ai/hc/en-us/articles/14149727495831-Troubleshooting-Notetaker
- "Meeting is set in the future": Notetaker can't join a meeting that hasn't started. This mainly affects Zoom, "but may also be applicable to other meeting platforms (e.g. Google Meet...)". Source: same as above.
- Also listed:
  - Host ended the meeting before Notetaker joined
  - Meeting reached maximum attendee capacity
  - Platform outages (check Google's status dashboard, https://www.google.com/appsstatus/dashboard/)

  Source: same as above.
- Event not syncing: "Notetaker will not be able to join your meeting automatically if the event does not sync to Otter." Use the resync button. Update events "at least 30 minutes before the meeting time"; with less than 30 minutes to go, add Otter manually. Source: same as above.
- Calendar connection: Integrations > Connect for Google or Microsoft, then authorise. The calendar email does not need to match the Otter email. Source: https://help.otter.ai/hc/en-us/articles/4425393298327-Otter-Notetaker-Overview
- Calendar sync problems:
  - The org admin may block third-party apps.
  - You must click Allow (Google) or Yes (Microsoft) when connecting.
  - To refresh, disconnect and reconnect in Apps > Connect calendars & contact.
  - Only events on the primary calendar sync, not "Other calendars", holiday, task, birthday or reminder calendars.

  Source: https://help.otter.ai/hc/en-us/articles/4449302944663-Troubleshooting-calendar-issues
- Auto-join setting: Account Settings > Meetings > Auto-join. The options are:
  - Meetings with a video link
  - Meetings where I am the host
  - External meetings outside your domain
  - Internal meetings within your domain
  - Meetings I manually select

  The external and internal options apply only to Workspaces with a business domain. Source: https://help.otter.ai/hc/en-us/articles/13675989227543-Manage-your-Otter-Notetaker-settings
- Workspace admins can set and lock the default under Manage Workspace → Settings → "Auto-join setting for workspace members". They can turn Notetaker off per member under Manage Workspace → Members (Notetaker column). Source: https://help.otter.ai/hc/en-us/articles/39339238308503-Recording-Permissions-with-Otter
- Multiple bots (deduplication): "Only the primary recorder's Notetaker will join the meeting." This is on by default within a Workspace. Non-primary members see the toggle "off and grayed out". Guests from other Workspaces still get their own Notetaker. Sources: https://help.otter.ai/hc/en-us/articles/13676401135383-How-many-meetings-can-Otter-Notetaker-join-simultaneously and https://help.otter.ai/hc/en-us/articles/22769249550103-Otter-Notetaker-Deduplication
- Concurrency: "Otter Notetaker can join multiple meetings concurrently on all paid plans". The number allowed per plan is on the pricing page. Source: https://help.otter.ai/hc/en-us/articles/13676401135383-How-many-meetings-can-Otter-Notetaker-join-simultaneously
- Bot name: "[Your Name]'s Notetaker (Otter.ai)", or the Workspace name when deduplication is on. Source: https://help.otter.ai/hc/en-us/articles/4425393298327-Otter-Notetaker-Overview
- Leaves after 12 continuous minutes of silence (5 minutes once past the scheduled end). There is a 4-hour transcription limit. Sources: https://help.otter.ai/hc/en-us/articles/14149727495831-Troubleshooting-Notetaker and https://help.otter.ai/hc/en-us/articles/4425393298327-Otter-Notetaker-Overview
- Basic (free) plan limits:
  - 300 minutes per month; "If you exceed the transcription limit, you will not be able to record or import recordings until your next monthly cycle." Deleted conversations still count.
  - 30 minutes per conversation (recording continues, but only 30 minutes is accessible).
  - 3 imports per account.
  - 25 most recent conversations.

  Source: https://help.otter.ai/hc/en-us/articles/360047538094-Conversation-import-and-app-limits-on-the-Basic-free-plan
- **Whether Basic users get one concurrent Notetaker, and whether Notetaker refuses to join once the 300 minutes are used: UNCONFIRMED.** The help page says recording stops; a refusal to join is implied but not stated.
- **Meeting language or region as a join cause (Otter): UNCONFIRMED.** Not documented.

### Otter: add Notetaker to a running Meet call

- Copy the Meet URL. On the Otter homepage, click the "Paste meeting URL to add Otter" field, paste it, then press Enter/Return or click Record. Notetaker joins "momentarily"; it "may take up to a few minutes". The host may need to admit it from the waiting room. Source: https://help.otter.ai/hc/en-us/articles/13676219922711-Manually-add-Otter-Notetaker-to-a-meeting
  - The troubleshooting page calls the same field "Paste meeting URL to record". Source: https://help.otter.ai/hc/en-us/articles/14149727495831-Troubleshooting-Notetaker
- From a live calendar event: the event shows a Notetaker button once the meeting has started; click it. "The Add Notetaker button will only appear once the meeting has started." Refresh the page if you don't see it. Source: https://help.otter.ai/hc/en-us/articles/13676219922711-Manually-add-Otter-Notetaker-to-a-meeting
- Botless alternative: the Otter Desktop app records without a Notetaker participant. Source: https://help.otter.ai/hc/en-us/articles/4425393298327-Otter-Notetaker-Overview

---

## UNCONFIRMED summary

1. HubSpot custom property limits for Free or Starter: no official number found.
2. HubSpot: exact "drag a deal card to another stage" wording on desktop board view.
3. HubSpot: the seat type a free-tools user gets ("free seats" is named but not described).
4. HubSpot: exact filters for a "my open deals" view; which deal report templates are on free; and whether conditional (required) stage properties work on free (no subscription gate is stated, but not tested).
5. Google Workspace admin: the current console labels for the not-signed-in / external participant option (only the 2021 blog and Fireflies' wording are available).
6. Fireflies: whether the bot stops joining when free credits or storage run out; multiple Fireflies bots; language as a join cause.
7. Otter: concurrency on Basic; whether Notetaker refuses to join after 300 minutes; language as a join cause.
8. Conflict: Google says third-party note-taker bots that "Ask to join" are auto-denied, while Fireflies and Otter tell hosts to admit the bot from the waiting room. This needs a hands-on test before the article states either.
