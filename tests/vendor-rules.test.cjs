const { test } = require('node:test');
const assert = require('node:assert/strict');
const host = process.env.FIRESTORE_EMULATOR_HOST;
if (!host || !/^(127\.0\.0\.1|localhost):\d+$/.test(host)) throw Error('Set FIRESTORE_EMULATOR_HOST to a local Firestore emulator; production is never used.');
const project = 'demo-infaithjourney';
const base = `http://${host}/v1/projects/${project}/databases/(default)/documents`;
function token(uid) {
  const now = Math.floor(Date.now() / 1000);
  const payload = { iss: `https://securetoken.google.com/${project}`, aud: project, sub: uid, user_id: uid,
    auth_time: now, iat: now, exp: now + 3600, firebase: { sign_in_provider: 'custom', identities: {} } };
  return `${Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')}.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.`;
}
function headers(uid) { return { 'Content-Type': 'application/json', Authorization: `Bearer ${uid === 'owner' ? 'owner' : token(uid)}` }; }
async function seed() {
  for (const uid of ['alice', 'bob']) {
    const res = await fetch(`${base}/vendorApplications/${uid}-app`, { method: 'PATCH', headers: headers('owner'),
      body: JSON.stringify({ fields: { submitterUid: { stringValue: uid }, applicationStatus: { stringValue: 'approved' } } }) });
    assert.equal(res.status, 200, await res.text());
  }
}
function query(uid, filterUid) {
  return fetch(`${base}:runQuery`, { method: 'POST', headers: headers(uid), body: JSON.stringify({ structuredQuery: {
    from: [{ collectionId: 'vendorApplications' }], limit: 100,
    ...(filterUid ? { where: { fieldFilter: { field: { fieldPath: 'submitterUid' }, op: 'EQUAL', value: { stringValue: filterUid } } } } : {}),
  } }) });
}

test('Firestore application rules allow own profile and reject access to other applicants', async () => {
  await seed();
  const own = await query('alice', 'alice');
  assert.equal(own.status, 200, await own.clone().text());
  const data = await own.json(); assert.equal(data[0].document.fields.submitterUid.stringValue, 'alice');
  const linked = await fetch(`${base}/vendorApplications/alice-app`, { headers: headers('alice') });
  assert.equal(linked.status, 200);
  assert.equal((await query('alice', 'bob')).status, 403);
  assert.equal((await query('alice')).status, 403);
  assert.equal((await fetch(`${base}/vendorApplications/bob-app`, { headers: headers('alice') })).status, 403);
  assert.equal((await fetch(`${base}/vendorApplications/alice-app`)).status, 403);
});
