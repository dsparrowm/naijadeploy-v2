export async function sendPasswordResetEmail(input: { to: string; url: string }) {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM?.trim()

  if (apiKey && from) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: "Reset your naijaDeploy password",
        text: `Reset your naijaDeploy password:\n\n${input.url}\n\nThis link expires in one hour.`,
      }),
    })
    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      throw new Error(detail || "Could not send the reset email")
    }
    return
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[naijaDeploy] Password reset for ${input.to}: ${input.url}`)
    return
  }

  throw new Error("Password reset email is not configured. Set RESEND_API_KEY and RESEND_FROM.")
}
