export interface ShortenOptions {
  baseUrl: string
  codeLength?: number
}

export interface ShortenResult {
  code: string
  shortUrl: string
  normalizedUrl: string
}

/**
 * Generates a short URL code and builds the final short URL.
 * @param longUrl - The original URL to shorten.
 * @param options - Configuration including base URL and optional code length.
 * @returns A promise that resolves with the generated code and related info.
 */
export async function createShortUrl(longUrl: string, options: ShortenOptions): Promise<ShortenResult> {
  const normalizedUrl = normalizeUrl(longUrl)
  const baseUrl = normalizeBaseUrl(options.baseUrl)
  const codeLength = validateCodeLength(options.codeLength)

  const code = await generateCode(`${normalizedUrl}:${createRandomSegment(8)}`, codeLength)
  return {
    code,
    shortUrl: `${baseUrl}/${code}`,
    normalizedUrl,
  }
}

/**
 * Verifies the URL is valid HTTP(S) and returns its canonical string form.
 * @param candidate - The URL string provided by the caller.
 * @returns The normalized URL string.
 * @throws If the URL is invalid or uses an unsupported protocol.
 */
function normalizeUrl(candidate: string): string {
  try {
    const parsed = new URL(candidate)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Unsupported protocol')
    }
    return parsed.toString()
  } catch {
    throw new Error('Invalid URL')
  }
}

/**
 * Ensures the base URL is non-empty and strips trailing slashes.
 * @param baseUrl - The base URL from configuration.
 * @returns The normalized base URL without trailing slashes.
 * @throws If the base URL is missing.
 */
function normalizeBaseUrl(baseUrl: string): string {
  if (!baseUrl) {
    throw new Error('Missing base URL')
  }
  return baseUrl.replace(/\/+$/, '')
}

/**
 * Produces a base62 code from a hashed seed, filling with random data if needed.
 * @param seed - A string used to seed the hash.
 * @param desiredLength - The desired length of the generated code.
 * @returns A promise that resolves with the generated code.
 */
async function generateCode(seed: string, desiredLength: number): Promise<string> {
  const data = textEncoder.encode(seed)
  const digest = await cryptoObj.subtle.digest('SHA-256', data)
  const hashBytes = new Uint8Array(digest)

  let code = ''
  let index = 0
  while (code.length < desiredLength && index < hashBytes.length) {
    code += BASE62_ALPHABET[hashBytes[index] % BASE62_ALPHABET.length]
    index += 1
  }

  if (code.length < desiredLength) {
    const fallback = new Uint8Array(desiredLength - code.length)
    cryptoObj.getRandomValues(fallback)
    for (const byte of fallback) {
      code += BASE62_ALPHABET[byte % BASE62_ALPHABET.length]
    }
  }

  return code
}

/**
 * Creates a random base62 string using cryptographically secure random values.
 * @param length - The length of the segment to generate.
 * @returns The generated random string.
 */
function createRandomSegment(length: number): string {
  const bytes = new Uint8Array(length)
  cryptoObj.getRandomValues(bytes)

  let segment = ''
  for (const byte of bytes) {
    segment += BASE62_ALPHABET[byte % BASE62_ALPHABET.length]
  }
  return segment
}

type CryptoLike = {
  getRandomValues(data: Uint8Array): void
  subtle: {
    digest(algorithm: string, data: ArrayBufferView | ArrayBuffer): Promise<ArrayBuffer>
  }
}

const BASE62_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

const textEncoder = new TextEncoder()

const cryptoObj = (() => {
  const candidate = (globalThis as { crypto?: CryptoLike }).crypto
  if (!candidate) {
    throw new Error('Web Crypto API is not available in this runtime')
  }
  return candidate
})()

/**
 * Validates the requested code length, defaulting when unspecified.
 * @param length - The requested code length or undefined.
 * @returns A valid positive integer code length.
 * @throws If the provided length is not a positive integer.
 */
function validateCodeLength(length: number | undefined): number {
  if (length === undefined) {
    return 7
  }

  if (!Number.isInteger(length) || length <= 0) {
    throw new Error('Invalid code length')
  }

  return length
}
