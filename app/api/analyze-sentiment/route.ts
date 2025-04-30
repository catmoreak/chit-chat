import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { text, apiKey, apiUrl } = await req.json()

    if (!text || !apiKey || !apiUrl) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const response = await fetch(`${apiUrl}/v1/analyze?version=2022-04-07`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`apikey:${apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify({
        text,
        features: {
          emotion: {},
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`IBM API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in sentiment analysis:", error)
    return NextResponse.json({ error: "Failed to analyze sentiment" }, { status: 500 })
  }
}
