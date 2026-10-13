import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto"

const VERSION = "v1"

function masterKey() {
  const raw = process.env.ENV_ENCRYPTION_KEY?.trim()
  if (!raw) {
    throw new Error("ENV_ENCRYPTION_KEY is not set")
  }
  const key = Buffer.from(raw, "base64")
  if (key.length !== 32) {
    throw new Error("ENV_ENCRYPTION_KEY must be 32 bytes, base64-encoded")
  }
  return key
}

/** AES-256-GCM. Ciphertext layout: `v1.<iv>.<tag>.<data>`, each segment base64. */
export function encryptEnvValue(plaintext: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", masterKey(), iv)
  const data = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return {
    iv: iv.toString("base64"),
    valueCiphertext: `${VERSION}.${tag.toString("base64")}.${data.toString("base64")}`,
  }
}

export function decryptEnvValue(valueCiphertext: string, iv: string) {
  const [version, tag, data] = valueCiphertext.split(".")
  if (version !== VERSION || !tag || !data) {
    throw new Error("Unrecognised env value ciphertext")
  }
  const decipher = createDecipheriv("aes-256-gcm", masterKey(), Buffer.from(iv, "base64"))
  decipher.setAuthTag(Buffer.from(tag, "base64"))
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(data, "base64")),
    decipher.final(),
  ])
  return plaintext.toString("utf8")
}
