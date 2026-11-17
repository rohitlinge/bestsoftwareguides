---
title: "Fix: Fireflies or Otter Bot Not Joining Google Meet"
description: "Why Fireflies and Otter note takers fail to join Google Meet calls, from Meet access settings to calendar sync, and how to add the bot to a call that has already started."
type: "fix-it"
category: "ai-meeting-note-takers"
updated: "2026-11-15"
---

**Short answer:** A Fireflies or Otter bot usually fails to join Google Meet for one of four reasons. **No one admitted it:** it joins as a guest and has to be let in. **The meeting blocks guests:** your or the host's Workspace settings stop people who aren't signed in. **The calendar event didn't sync** or has no Meet link. **Auto-join is set to skip that meeting.** The fastest fix during a call is to paste the Meet link into the tool: **Capture > Add to live meeting** in Fireflies, or **Paste meeting URL to add Otter** on Otter's home page. Then admit the bot.

Every cause and fix below comes from the Fireflies, Otter and Google help pages linked in each section, checked November 15, 2026.

## Step 1: What does the tool say went wrong?

Check the tool's own status before changing any settings.

- **Fireflies:** bell icon (top right) > **Status** tab. It shows statuses such as *Denied Entry*, *In Waiting Room / Not allowed in*, *Connection Failed* and *Meeting requires sign-in* ([Fireflies: Why Fred did not join](https://guide.fireflies.ai/articles/4708529470-why-fred-did-not-join-your-meeting-troubleshooting-guide)).
- **Otter:** the event on the home-page calendar shows the error. If it doesn't, click the event > **Open Conversation** and read the Notetaker message ([Otter: Troubleshooting Notetaker](https://help.otter.ai/hc/en-us/articles/14149727495831-Troubleshooting-Notetaker)).

| Message | Most likely cause | Go to |
|---|---|---|
| In waiting room / not admitted / denied | No one let the bot in | Step 2 |
| Meeting requires sign-in / requires user to sign in | Guests are blocked | Step 3 |
| Bot never tried to join | Calendar or auto-join setting | Step 4 |
| Waited for the host | Host had not started the meeting | Step 5 |

## Step 2: Was the bot admitted?

Both bots join Google Meet as **guests**, so under Meet's *Trusted* and *Restricted* access they have to ask to join.

- **Admit it:** when the request appears, click **Admit**. Only the meeting organiser can approve requests ([Google: Manage participants](https://support.google.com/meet/answer/9303164?hl=en&co=GENIE.Platform%3DDesktop)).
- **No Admit button?** Open the **People** panel, find **With potential risks**, click ⋮ next to the Fireflies Notetaker and choose **Admit entry**. Fireflies says the label is a Meet security change and "does not indicate any risk" ([Fireflies: Invite to Google Meet](https://guide.fireflies.ai/articles/7581948912-how-to-invite-fireflies-to-google-meet-meetings)).
- **Timing:** Fireflies waits in the lobby up to 10 minutes on Google Meet ([Fireflies FAQ](https://guide.fireflies.ai/articles/9554534786)). Otter keeps trying for about 12 minutes, then leaves.
- **Request never appears:** Google's help says third-party bots, like note takers, that try "Ask to join" are automatically denied ([Google: Meeting access](https://support.google.com/meet/answer/9302870?hl=en&co=GENIE.Platform%3DDesktop)). If you want the bot in a meeting you host, set **Meeting access** to **Open** for that call ("No one has to knock"). Before the call, change it in the Calendar event > **Video call options** > **Host controls**; during it, use **Host controls** (bottom right).

## Step 3: Does the meeting allow guests who aren't signed in?

Otter says "the meeting must allow external guests for Notetaker to successfully join", and it cannot sign in to your company's account to get round the rule ([Otter: Notetaker overview](https://help.otter.ai/hc/en-us/articles/4425393298327-Otter-Notetaker-Overview)). Fireflies says the same.

- **Quick test:** open the Meet link in an incognito window without signing in. Fireflies' advice: "If they're blocked there, Fireflies will be blocked too."
- **Workspace admins:** Admin console > **Apps** > **Google Workspace** > **Google Meet** > **Meet safety settings**. Fireflies says to set the access option to allow all users, including people not signed in with a Google account. Changes can take up to 24 hours ([Google: Meet settings](https://knowledge.workspace.google.com/admin/meet/manage-meet-settings?hl=en)).
- **Someone else's meeting:** the **host's** organisation settings decide. If they block guests, ask the host's IT team, or record the call another way.

## Step 4: Is the calendar synced and auto-join on?

**Fireflies** ([Fix auto-join settings](https://guide.fireflies.ai/articles/5074225515-fix-fireflies-auto-join-settings)):

1. Check that your calendar is connected, and that the event has a Meet link and was created before the meeting started.
2. Go to Home > **Settings** > **Auto-join calendar meetings**. If it is set to *Only meetings that I own* and you're only a guest, Fred won't join. Choose *All meetings with web-conf link*, or invite fred@fireflies.ai to the event.
3. Check your **Meeting Rules**. Bar Rules and Join Rules override auto-join.

**Otter** ([Manage Notetaker settings](https://help.otter.ai/hc/en-us/articles/13675989227543-Manage-your-Otter-Notetaker-settings), [Calendar issues](https://help.otter.ai/hc/en-us/articles/4449302944663-Troubleshooting-calendar-issues)):

1. Go to Account Settings > **Meetings** > **Auto-join**. *Meetings I manually select* means nothing joins by itself.
2. Only events on your **primary** calendar sync. Events on other calendars are skipped.
3. Change events at least **30 minutes** before they start, or use the resync button. Closer to the start, add Otter by hand (Step 6).
4. If you are in an Otter Workspace, only the primary recorder's Notetaker joins. Your toggle shows as off and greyed out, which is expected ([Otter: Deduplication](https://help.otter.ai/hc/en-us/articles/22769249550103-Otter-Notetaker-Deduplication)).

## Step 5: Did the meeting start on time?

- Otter waits up to 5 minutes for the host and tries up to four times. It recommends letting participants join before the host.
- Fireflies joins at the scheduled start. If the call starts much later, add it again by hand.
- In Google Meet, **Host must join before anyone else** stops the bot from getting in early ([Google: Meeting access](https://support.google.com/meet/answer/9302870?hl=en&co=GENIE.Platform%3DDesktop)).

## Step 6: How do I add the bot to a call that has started?

**Fireflies** ([Add to an ongoing meeting](https://guide.fireflies.ai/articles/9977523795-how-to-add-fireflies-to-an-ongoing-meeting)):

1. Click **Capture** (top right) > **Add to live meeting**.
2. Paste the Meet link, and optionally set the meeting name and language.
3. Click **Start capture**. The bot arrives in 30 seconds to 2 minutes. You don't need to be the host, but the host must admit it.

**Otter** ([Manually add Notetaker](https://help.otter.ai/hc/en-us/articles/13676219922711-Manually-add-Otter-Notetaker-to-a-meeting)):

1. Copy the Meet link.
2. On the Otter home page, paste it into **Paste meeting URL to add Otter** and press Enter, or click **Record**.
3. Alternatively, click the **Notetaker** button on the live calendar event. It only appears once the meeting has started.

## Could a free-plan limit be the problem?

- **Otter Basic:** 300 minutes a month and 30 minutes per conversation. Otter says that once you go over the monthly limit you "will not be able to record" until the next cycle ([Otter: Basic plan limits](https://help.otter.ai/hc/en-us/articles/360047538094-Conversation-import-and-app-limits-on-the-Basic-free-plan)).
- **Fireflies Free:** 400 minutes of storage per seat. Delete older files to store new ones ([Fireflies: Free plan](https://guide.fireflies.ai/articles/4027724828-learn-about-the-fireflies-free-plan)).

If guests are blocked on most of your calls, a tool that records from your computer instead of sending a bot avoids the problem. Otter's desktop app is one; compare others in our [AI meeting note takers ranking](/best/ai-meeting-note-takers/). To keep bots **out** of your calls, see [how to stop AI note takers joining](/blog/stop-ai-note-taker-joining-calls/).
