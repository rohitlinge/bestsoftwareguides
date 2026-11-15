---
title: "How to Stop AI Note Takers Joining Your Calls"
description: "The exact settings in Zoom, Google Meet and Microsoft Teams that keep AI note-taker bots out, how to remove one mid-call, and how to switch off Otter and Fireflies auto-join."
type: "how-to"
category: "ai-meeting-note-takers"
updated: "2026-11-15"
---

**Short answer:** In **Google Meet**, set Meeting access to *Trusted* or *Restricted* and turn off knocking: Google says note-taker bots that try "Ask to join" are then denied automatically. In **Microsoft Teams**, set "Who can bypass the lobby?" to *Only organizers and co-organizers* and admit no one you don't recognise; admins can make Teams send detected bots to the lobby. In **Zoom**, turn on the waiting room and "Only authenticated users can join", and admins can block specific bot apps. To stop **your own** note taker, change Otter's auto-join setting to *Meetings I manually select*, or Fireflies' to *Only when I invite fred@fireflies.ai*.

Every step below comes from the vendor's own help page, linked in each section, checked November 15, 2026. Menu names change often; if one looks different, follow the link for the current wording.

## Why do note takers join meetings you didn't invite them to?

Most AI note takers connect to a user's calendar and join every meeting on it that has a video link. If one guest has auto-join switched on, their bot arrives at your meeting too. You can stop that in two places: **the meeting platform** (who is allowed in) and **the note-taker account** (whether it joins by itself).

## How do I stop note takers joining Google Meet?

Host or organiser, per meeting ([Google: Meeting access](https://support.google.com/a/users/answer/11989526?hl=en)):

1. Before the call: in Google Calendar, open the event > **Settings** (gear) > **Host controls** > **Meeting access**. During the call: open the **Host controls** panel > **Meeting access**.
2. Choose **Trusted** (your organisation and invited guests join directly) or **Restricted** (only invitees join; not available on personal Google accounts).
3. Untick **Anyone with the meeting link can ask to join** (Trusted) or **Anyone can ask to join, including people who dial in** (Restricted). Google says this turns off knocking for the whole meeting, and "third-party bots, like note takers, that attempt to use 'Ask to join' are automatically denied access."
4. Turn on **Host must join before anyone else**, which Google recommends using with step 3.

To remove a bot that is already in the call: hover over its tile > **More options** > **Remove from the call** ([Google: Remove participants](https://support.google.com/meet/answer/9303164?hl=en&co=GENIE.Platform%3DDesktop)).

**Workspace admins** can set defaults for the whole organisation in the Admin console > Apps > Google Workspace > Google Meet > **Meet safety settings** ([Google: Meet settings](https://knowledge.workspace.google.com/admin/meet/manage-meet-settings?hl=en)).

## How do I stop note takers joining Microsoft Teams?

Organiser, per meeting ([Microsoft: Using the lobby](https://support.microsoft.com/en-us/teams/meetings/using-the-lobby-in-microsoft-teams-meetings)):

1. Calendar > open the event > **View event** > **Options** > **Meeting access**. During the call: **Controls** > **View more options** > **Meeting access**.
2. Set **Who can bypass the lobby?** to **Only organizers and co-organizers** (or **People who were invited**).
3. Turn off **People dialing in can bypass the lobby**.
4. When people wait in the lobby, admit only those you recognise. Teams sorts identified bots into **Waiting** (registered bots) and **Suspected threats**, and asks you to confirm before admitting a bot that may record.

To remove a bot that is already in the call: **People** > hover over the name > **More options** > **Remove from meeting**. Organisers, co-organisers and presenters can do this; attendees cannot.

**Teams admins** can set the policy for everyone in the Teams admin center > Meetings > Meeting policies > **Meeting join & lobby**: the setting **Manage external bots and their access to meetings** set to *When detected, require approval before joining* sends detected bots to the lobby whatever the meeting's own settings ([Microsoft Learn: Manage external bots](https://learn.microsoft.com/en-us/microsoftteams/manage-external-bots)). Microsoft notes that some bots may not be detected.

## How do I stop note takers joining Zoom?

Zoom lists its bot controls on one page ([Zoom: Bots in meetings](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0088381)). For a host:

1. **Waiting room:** web portal > **Settings** > **Meeting** > **Security** > **Waiting Room**, then admit only people you recognise ([Zoom: Waiting room](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0059359)).
2. **Require sign-in:** **Settings** > **Meeting** > **Security** > **Only authenticated users can join meetings**, or tick **Require authentication to join** when scheduling. Needs a paid account, and an admin must set up authentication profiles first ([Zoom: Authentication](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0063837)).
3. **Remove a bot in the call:** **Host tools** (called **Security** in versions before 6.0) > **Remove participant**. A removed participant cannot rejoin unless "Allow removed participants to rejoin" is on ([Zoom: Remove participants](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0061231)).

**Zoom admins** can go further:

- **Block specific bot apps:** Admin Center > **Settings** > **General** > Security > **Manage which Zoom apps can join as a participant in meetings and webinars in your organization** > **Block specific SDK apps** ([Zoom: SDK app list](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0083775)).
- **Block domains:** **Block users in specific domains from joining meetings and webinars**, which only works together with required authentication ([Zoom: Block domains](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0063852)).
- **See what was blocked:** on Business, Enterprise and Education plans, Admin Center > **Dashboard** > Meetings > Past Meetings > **Meeting Apps** ([Zoom: Bot blocking dashboard](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0087564)).

## How do I stop my own Otter or Fireflies bot joining?

**Otter.ai** ([Otter: Stop auto-join](https://help.otter.ai/hc/en-us/articles/12906714508823-Stop-Otter-Notetaker-from-automatically-joining-your-meetings)):

1. On the home page, open the **Meetings** tab > **AI Notetaker settings** > choose **Meetings I manually select**. (Or Account settings > **Integrations** > **Meetings** > **Default auto-join settings**.)
2. Check your calendar afterwards: meetings you switched on one by one keep that setting.
3. In a live call, anyone can type **stop otter** in the meeting chat to remove Otter ([Otter: Remove Notetaker](https://help.otter.ai/hc/en-us/articles/14288936562199-Remove-Otter-Notetaker-from-your-meeting-Zoom-Google-Meet-or-Microsoft-Teams)).

**Fireflies.ai** ([Fireflies: Disable auto-join](https://guide.fireflies.ai/articles/8587670572-how-to-disable-the-fireflies-auto-join-settings)):

1. Home > **Settings** > **Auto-join calendar meetings** > choose **Only when I invite fred@fireflies.ai**. Or Settings > Personal > **Recording & Privacy** > turn off **Auto-record meetings**.
2. For a single meeting, switch Fireflies off in the **Upcoming** tab, or remove fred@fireflies.ai from the invite.
3. In a live call, remove it from the participant list or type **/ff leave** in the meeting chat ([Fireflies: Remove from a meeting](https://guide.fireflies.ai/articles/7098191513-how-to-remove-fireflies-from-a-meeting)).

## Which setting should I use?

| Situation | Best setting |
|---|---|
| One-off sensitive call on Google Meet | Restricted access, knocking off, host joins first |
| One-off sensitive call on Teams | Lobby bypass: only organizers and co-organizers |
| One-off sensitive call on Zoom | Waiting room plus authenticated users only |
| Stop bots across your whole organisation | Admin policy: Meet safety settings, Teams external bot policy, or Zoom SDK app block list |
| Your own bot keeps joining | Otter "Meetings I manually select" or Fireflies "Only when I invite fred@fireflies.ai" |

If you do want a note taker for your own calls, compare them in our [AI meeting note takers ranking](/best/ai-meeting-note-takers/). If those calls involve patient information, read [what a BAA is and which note takers sign one](/blog/what-is-a-baa-hipaa-note-takers/) first.
