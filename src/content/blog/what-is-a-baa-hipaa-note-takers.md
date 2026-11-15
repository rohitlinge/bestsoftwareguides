---
title: "What a BAA Is and Why HIPAA Note Takers Need One"
description: "A Business Associate Agreement is the contract HIPAA requires before a vendor handles patient data. Which AI note takers sign one, on which plan, and what it does not cover."
type: "explained"
category: "ai-meeting-note-takers"
updated: "2026-11-15"
---

**Short answer:** A Business Associate Agreement (BAA) is the written contract HIPAA requires before a healthcare provider, health plan or clearinghouse lets a vendor create, receive, store or transmit protected health information (PHI) on its behalf. An AI note taker that records and transcribes calls containing patient information falls under that rule. As of November 15, 2026, **Otter.ai, Fireflies.ai and Read AI** offer a BAA only on their enterprise plans, **Fathom** includes a standard BAA from its Team plan, and **tl;dv** does not mention HIPAA or a BAA on its website.

*This is a plain-English summary of US Department of Health and Human Services (HHS) guidance, not legal advice.*

## What is a Business Associate Agreement?

Under HIPAA, a **business associate** is a person or company that performs a function for a covered entity that involves creating, receiving, maintaining or transmitting PHI. A covered entity may share PHI with a business associate only after getting "satisfactory assurances" in a written contract: the BAA ([HHS: Business Associates](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html)).

HHS lists "the vendor of an app that provides transcription services to a physician" as an example of a business associate. Its cloud guidance says a cloud provider that processes or stores electronic PHI for a covered entity is a business associate "even if the CSP processes or stores only encrypted ePHI and lacks an encryption key" ([HHS: Guidance on HIPAA and cloud computing](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html)).

## Does an AI note taker need a BAA?

Yes, if the calls it records contain PHI. A note taker records, transcribes and stores the conversation, so it is not a simple "conduit" like a postal service; HHS says entities that access PHI regularly to perform a service "are not conduits." HHS has not published guidance that names AI meeting note takers specifically, but they fit both the transcription-vendor example and the cloud-provider rule above.

Otter.ai's own help center puts it the same way: a BAA "must be executed with Otter.ai before any such data is handled" ([Otter.ai: HIPAA](https://help.otter.ai/hc/en-us/articles/33975072019991-HIPAA-Otter-ai)).

## Which AI note takers sign a BAA?

| Note taker | BAA offered? | Plan required | Source |
|---|---|---|---|
| [Otter.ai](/tools/otter-ai/) | Yes | Enterprise only | [Otter help center](https://help.otter.ai/hc/en-us/articles/33975072019991-HIPAA-Otter-ai) |
| [Fireflies.ai](/tools/fireflies-ai/) | Yes | Enterprise only, plus Private Storage | [Fireflies guide](https://guide.fireflies.ai/articles/3704059205-set-up-hipaa-compliance-for-your-workspace) |
| [Fathom](/tools/fathom/) | Yes, standard BAA | Team ($15/user/month, 2-user minimum) and above; custom BAA on Enterprise | [Fathom pricing](https://fathom.ai/pricing) |
| [Read AI](/tools/read-ai/) | Yes | Enterprise+ annual, 5-licence minimum | [Read AI support](https://support.read.ai/hc/en-us/articles/37076084515219-Enabling-HIPAA-Compliance-in-Read-AI-Workspaces) |
| [tl;dv](/tools/tldv/) | Not stated | — | Not mentioned on its [pricing](https://tldv.io/pricing/) or [security](https://tldv.io/features/security-commitment/) pages |

Two details matter in practice. Fireflies says a BAA and Private Storage are "both required – one without the other won't enable HIPAA," and that downgrading your plan switches HIPAA compliance off immediately. Read AI's HIPAA workspaces auto-join a meeting only when the user is the host.

## What must a BAA contain?

HHS summarises the required terms ([HHS: Sample BAA provisions](https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions/index.html)). The contract must:

1. Set out the permitted and required uses and disclosures of PHI.
2. Forbid any other use or disclosure, except as the contract allows or the law requires.
3. Require appropriate safeguards, including the HIPAA Security Rule for electronic PHI.
4. Require the vendor to report any use or disclosure the contract does not allow, including breaches of unsecured PHI.
5. Require the vendor to help with patients' requests to access, amend or get an accounting of their PHI.
6. Require Privacy Rule compliance where the vendor carries out a covered entity's obligation.
7. Make the vendor's books and records available to HHS.
8. Require PHI to be returned or destroyed when the contract ends, where feasible.
9. Require the vendor's subcontractors to accept the same restrictions.
10. Let the covered entity end the contract if the vendor breaks a material term.

HHS's sample wording is optional; the terms are what count.

## What does a BAA not do?

- **It does not make a tool "HIPAA compliant."** HHS says it does "not certify any persons or products as 'HIPAA compliant'" ([HHS: misleading marketing claims](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/be-aware-misleading-marketing-claims/index.html)).
- **It does not replace your own safeguards.** Covered entities and business associates must each do a risk analysis, and some controls, such as user authentication and sharing settings, stay the customer's job ([HHS cloud guidance](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html)).
- **It does not cover careless setup.** Otter tells healthcare customers to turn off public and link sharing themselves, and Read AI asks customers not to put PHI in meeting titles or calendar events.

## What should you check before buying?

1. The plan that includes the BAA, and its real cost: for most of these tools that is the enterprise tier, not the advertised entry price.
2. That the BAA is signed before any call with patient information is recorded.
3. Workspace settings: sharing, retention, and who can invite the note taker.
4. Your own risk analysis, updated to include the new vendor.

Compare prices and HIPAA options side by side in our [AI meeting note takers ranking](/best/ai-meeting-note-takers/), which shows each tool's HIPAA option in its feature table.

*Facts checked November 15, 2026 on the HHS and vendor pages linked above.*
