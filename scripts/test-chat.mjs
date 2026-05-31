#!/usr/bin/env node
// Usage: node scripts/test-chat.mjs <mode> [base-url]
// Modes: space | money | idea | need

const OPENERS = {
  space: "I have a vacant 2,000 sq ft storefront in south St. Louis city. Used to be a hardware store, been empty for about 3 years now.",
  money: "I'm with a small family foundation and we have around $150,000 we'd like to deploy into community space projects in St. Louis.",
  idea: "I have this idea for a community workshop where teens can learn trades like woodworking and basic welding. I don't have a space or funding yet.",
  need: "Our north city neighborhood has no safe indoor space for kids after school. The rec center closed two years ago and nothing has replaced it.",
};

const mode = process.argv[2];
const baseUrl = (process.argv[3] || 'https://commonground-mu.vercel.app').replace(/\/$/, '');

if (!OPENERS[mode]) {
  console.error(`Unknown mode "${mode}". Valid modes: ${Object.keys(OPENERS).join(', ')}`);
  process.exit(1);
}

console.log(`\nMode:    ${mode}`);
console.log(`Target:  ${baseUrl}/api/chat`);
console.log(`Message: "${OPENERS[mode].slice(0, 60)}..."\n`);

const start = Date.now();

let res;
try {
  res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode,
      messages: [{ role: 'user', content: OPENERS[mode] }],
      stream: true,
    }),
  });
} catch (err) {
  console.error(`Network error: ${err.message}`);
  process.exit(1);
}

if (res.status === 429) {
  console.error('Rate limited (429) — too many requests in window');
  process.exit(1);
}

if (!res.ok) {
  const body = await res.text();
  console.error(`HTTP ${res.status}: ${body}`);
  process.exit(1);
}

const reader = res.body.getReader();
const decoder = new TextDecoder();
let tokenCount = 0;
let fullText = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value, { stream: true });
  for (const line of chunk.split('\n')) {
    if (!line.startsWith('data: ')) continue;
    const raw = line.slice(6).trim();
    if (raw === '[DONE]') break;
    try {
      const delta = JSON.parse(raw).choices?.[0]?.delta?.content || '';
      if (delta) { tokenCount++; fullText += delta; }
    } catch {}
  }
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1);

if (tokenCount === 0) {
  console.error('FAIL — stream returned no tokens');
  process.exit(1);
}

console.log(`PASS`);
console.log(`Tokens:  ${tokenCount}`);
console.log(`Time:    ${elapsed}s`);
console.log(`Preview: "${fullText.slice(0, 120).replace(/\n/g, ' ')}..."`);
