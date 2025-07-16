import { NextResponse } from "next/server"

const GOOGLE_SHEETS_WEBHOOK_URL =
  process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbz4Mrtqp3bFKPNa8VpDn8DDto0WYyTivoZPlEn2EPzUXw8aTyabtjpEQBKY7OIO2zZW/exec"
export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Dados recebidos no proxy:", data)

    const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro ao encaminhar para o Google Apps Script:", response.status, errorText)
      return NextResponse.json(
        { message: "Failed to send data to Google Sheets", error: errorText },
        { status: response.status },
      )
    }

    const result = await response.json()
    console.log("Resposta do Google Apps Script:", result)
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Erro no proxy da API:", error)
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 })
  }
}
