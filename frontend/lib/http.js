export const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export function backoff(base, attempt, jitter) {
  const value = base * 2 ** attempt;
  return jitter ? value + Math.floor(Math.random() * 50) : value;
}

export async function fetchWithResilience(
  url,
  opts = {}
) {
  const {
    retry = {},
    idempotencyKey,
    requestId,
    timeoutMs = 3000,
    ...init
  } = opts;

  const {
    retries = 2,
    baseDelayMs = 250,
    jitter = true
  } = retry;

  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");

  if (idempotencyKey) headers.set("Idempotency-Key", idempotencyKey);

  headers.set("X-Request-Id", requestId ?? crypto.randomUUID());

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      headers,
      signal: controller.signal
    });

    // Rate limit 429
    if (res.status === 429 && retries > 0) {
      const ra = Number(res.headers.get("Retry-After") || "1") * 1000;
      await sleep(ra);
      return fetchWithResilience(url, {
        ...opts,
        retry: { ...retry, retries: retries - 1 }
      });
    }

    // Retry on server errors
    if ([500, 502, 503, 504].includes(res.status) && retries > 0) {
      const attempt = opts.__attempt ?? 0;
      await sleep(backoff(baseDelayMs, attempt, jitter));

      return fetchWithResilience(url, {
        ...opts,
        __attempt: attempt + 1,
        retry: { ...retry, retries: retries - 1 }
      });
    }

    return res;
  } catch (e) {
    if (retries > 0) {
      const attempt = opts.__attempt ?? 0;
      await sleep(backoff(baseDelayMs, attempt, jitter));

      return fetchWithResilience(url, {
        ...opts,
        __attempt: attempt + 1,
        retry: { ...retry, retries: retries - 1 }
      });
    }
    throw e;
  } finally {
    clearTimeout(t);
  }
}
