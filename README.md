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
