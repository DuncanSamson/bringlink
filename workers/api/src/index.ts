import { Hono, Context } from 'hono'
import { env } from 'hono/adapter'
import { createShortUrl } from './urlShortener'

type EnvBindings = {
  SHORT_BASE_URL?: string
}

const app = new Hono<{ Bindings: EnvBindings }>()

app.get('/', (c: Context) => {
  return c.text('Hello Hono!')
})

app.post('/shorten', async (c: Context) => {
  let body: { url?: string; codeLength?: number } | null = null

  try {
    body = await c.req.json<{ url?: string; codeLength?: number }>()
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }

  if (!body?.url) {
    return c.json({ error: 'Missing "url" in request body' }, 400)
  }

  const { SHORT_BASE_URL } = env<{ SHORT_BASE_URL?: string }>(c) ?? {}
  const baseUrl = SHORT_BASE_URL || new URL(c.req.url).origin

  try {
    const { shortUrl } = await createShortUrl(body.url, {
      baseUrl,
      codeLength: body.codeLength,
    })
    
    // @todo: store the mapping of code to normalizedUrl in a database
    // storeShortenedUrl(code, normalizedUrl)

    return c.json({
      shortUrl,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    const status = message === 'Invalid URL' ? 400 : 500
    return c.json({ error: message }, status)
  }
})

app.all('*', (c: Context) => c.text('Not Found', 404))

export default app
