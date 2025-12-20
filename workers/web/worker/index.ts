import { Hono } from "hono"
const app = new Hono()
app.get('/api/', (c) => c.json({ name: 'Cloudflare' }))

app.all('*', (c) => c.text('Not Found', 404))
export default app