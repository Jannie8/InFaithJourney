# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Firebase App Hosting deployment

App Hosting resolves every secret referenced by `apphosting.yaml` before it starts
a build. A missing secret or a secret that the backend cannot access therefore
blocks the deployment, even when the feature using that secret is best-effort at
runtime.

### Local Firebase Admin credentials

Server routes that review applications or activate PayStack subscriptions use the
Firebase Admin SDK. App Hosting supplies credentials automatically, but `next dev`
does not. To test these routes locally, download a service-account JSON file from
**Firebase Console → Project settings → Service accounts → Generate new private
key** and store it outside the repository.

Set its absolute path in `.env.local`:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/infaithjourney-service-account.json
```

Alternatively, encode the JSON as a single line and put the result in `.env.local`:

```bash
FIREBASE_SERVICE_ACCOUNT_BASE64=<base64-encoded-service-account-json>
```

For example, on macOS or Linux:

```bash
base64 < /absolute/path/to/infaithjourney-service-account.json | tr -d '\n'
```

Restart `npm run dev` after changing `.env.local`. Never commit the service-account
file or either credential value. Production should continue using App Hosting's
Application Default Credentials rather than a downloaded key.

### Configure the Resend secret

Run these commands from the project directory while signed into the Firebase CLI:

```bash
firebase use dev
firebase apphosting:secrets:set resend-api-key
firebase apphosting:secrets:grantaccess resend-api-key --backend infaithjourney
```

When `secrets:set` prompts for a value, enter a Resend API key (normally beginning
with `re_`). Do not put the API key directly in `apphosting.yaml` or commit it to
Git. After setting and granting the secret, retry the failed rollout from Firebase
or push a new commit.

The PayStack secret referenced by the same configuration must be provisioned in
the same way if it has not already been created:

```bash
firebase apphosting:secrets:set paystack-secret-key
firebase apphosting:secrets:grantaccess paystack-secret-key --backend infaithjourney
```

### Verify the Resend sending domain

Do not add the Firebase `*.hosted.app` address as a Resend sending domain. Firebase
owns that domain and its DNS records cannot be edited in the project's DNS
provider. Add a domain owned by InFaith Journey in Resend instead, then copy the
DNS records supplied by Resend into that domain's Squarespace DNS settings. Once
Resend reports the domain as verified, make sure `APPROVAL_EMAIL_FROM` in
`apphosting.yaml` uses an address on that verified domain.

### Configure the AI concierge

Create a Gemini API key in Google AI Studio, then store it as an App Hosting
secret and grant the backend access:

```bash
firebase apphosting:secrets:set gemini-api-key
firebase apphosting:secrets:grantaccess gemini-api-key --backend infaithjourney
```

The AI concierge cannot contact Gemini until this secret is configured. Keep the
key server-side; never expose it through a `NEXT_PUBLIC_*` environment variable.

## Paystack subscription sync and cancellation

Paystack is the source of truth for recurring billing. Editing
`vendors/{uid}.membershipStatus` in Firestore does **not** cancel charges.
The cancellation API now checks Paystack independently of that field, disables
all renewable InFaith Journey subscriptions for the authenticated customer, and
reads each subscription back before marking the application cancelled. A failed
lookup, missing cancellation token, or unconfirmed disable returns an error;
the application must not claim billing has stopped.

### Production rollout

1. Deploy the billing fix to the Firebase App Hosting backend serving
   `https://infaithjourney.com`. Merging code alone is not evidence that the rollout
   completed; check the App Hosting rollout status and deployed commit.
2. In **Paystack Dashboard → Settings → API Keys & Webhooks**, select **Live** mode
   and set the webhook URL to
   `https://infaithjourney.com/api/paystack/webhook`. The callback URL used to return
   a browser from checkout is separate and does not replace this webhook.
3. Confirm the production `PAYSTACK_SECRET_KEY` and both `PAYSTACK_PLAN_*` values
   belong to the same Paystack account and mode. Never share or log the secret key.
4. In a test-mode environment with test plans and credentials, exercise initial
   checkout without returning to the website, renewal, failed renewal, and
   cancellation while Firestore says `pending_payment` or `awaiting_payment`.
   Confirm the webhook deliveries succeed, Firebase matches Paystack, and Paystack
   shows `non-renewing` or `cancelled` after website cancellation. Do not use the
   live production backend with test-mode credentials.
5. Check failed webhook deliveries and App Hosting logs. A `401` means the signature
   did not validate; `500` asks Paystack to retry a failed update. Do not work around
   signature failures by disabling signature verification.

Dashboard reconciliation and the billing details API also refresh Firebase from
Paystack. Recurring events match stable subscription/customer identifiers or the
billing email rather than the original checkout reference. Event handling reads
current Paystack state so a delayed disable for an old subscription cannot cancel
an active replacement. Cancelled applications cannot be reactivated by late charges.

### Repair existing cancelled accounts

For customers who cancelled on the website but were charged again, open their
customer record in the **Live Paystack Dashboard** and inspect **all** subscriptions,
including duplicate subscriptions. Disable each renewable membership subscription
and verify its status. The code deployment does not retroactively cancel existing
Paystack subscriptions, and manual Firestore edits cannot stop recurring billing.
After deployment, the authenticated customer can retry website cancellation even
if the application already says cancelled. The API is safe to retry after a partial
failure and skips subscriptions Paystack already reports as non-renewing/cancelled.

Review the unwanted transaction separately with the business owner and process
any approved refund through Paystack. No automatic refunds are performed by this fix.

### Billing regression checks

```bash
npm run test:billing
npm run typecheck:billing
npm run build
```

The regression suite uses mocked Paystack/Firebase responses and makes no real
charges. It covers initial activation without a browser callback, pending-payment
cancellation, duplicate subscriptions, API errors, confirmation failures, renewed
transaction references, delayed events, signature validation, and cancelled accounts.
The billing type check isolates these server files from existing unrelated project
syntax errors; the production config currently skips project-wide TypeScript errors.

## Vendor approval links and profile access

Public emails and Paystack return URLs use `SITE_URL` (default:
`https://infaithjourney.com`), never the reverse proxy's internal request origin.
App Hosting sets this runtime variable in `apphosting.yaml`. For a separate test
or preview deployment, set its own public HTTPS origin. For local development,
`SITE_URL=http://localhost:9002` is allowed outside production.

Free listings become active when approved. Their approval email opens
`/dashboard#vendor-profile` and does not request payment. Paid-plan emails open
`/dashboard#activate-membership`; the dashboard selects the billing tab and still
requires verified payment before activation. Both destinations retain the normal
sign-in flow. Already-delivered emails containing `0.0.0.0` cannot be changed;
those recipients can open the public website's dashboard directly.

The dashboard reads the signed-in user's applications with an ownership filter
and `limit(100)`, compatible with the previous deployed rules. It can also read
the application's canonical document via `vendors/{uid}.applicationId`. Loading
and read failures are shown explicitly rather than claiming the user never applied.
Free memberships are labelled Free Listing and never described as monthly billing.

The updated Firestore rules restrict application lists to the owning user or an
administrator. Deploy these rules separately from the App Hosting rollout:

```bash
firebase deploy --only firestore:rules --project infaithjourney-90d96
```

The application query fix also works with the previous rules, but deploy the new
rules to prevent other signed-in users listing applicants' private information.

Checks:

```bash
npm run test:vendor
npm run typecheck:vendor
npm run test:billing
npm run typecheck:billing
npm run build
```

To run the ownership checks, start a local Firestore emulator with this repository's
`firestore.rules` and project ID `demo-infaithjourney`, then run:

```bash
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run test:vendor-rules
```

The emulator checks allow own application queries/direct reads and deny unfiltered
lists, another user's applications, and signed-out access. These tests never use
production Firebase data or send emails or payments.

## Directory pricing and discoverability

Public vendor pricing ranges are parsed as separate ZAR amounts. For example,
`5000 - 10, 000` becomes R5,000–R10,000 rather than the joined number R500,010,000.
Formatting with currency symbols, thousands separators, cents, and `k`/`m`
shorthand is supported. Vendor prices are converted to thousands of rand only
for comparison with the sliders.

Default vendor/category budgets apply no price restriction. The maximum slider
position means an open upper limit (`+`); selecting a narrower range matches
vendors whose advertised range overlaps it. Unspecified prices stay visible by
default but do not claim a match to an explicitly narrowed budget. All active
membership tiers remain searchable in either catalogue view.

Run `npm run test:directory` and `npm run typecheck:directory` for regression
checks, including the reported Test vendor and both catalogue/category rendering.
These checks use local fixtures and do not change live vendor records.
