import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  try {
    const backendRes = await fetch('http://localhost:8000/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
      },
      body: JSON.stringify(req.body),
    })

    if (!backendRes.ok) {
      const text = await backendRes.text()
      res.status(backendRes.status).send(text)
      return
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=teklif.pdf')
    const buffer = Buffer.from(await backendRes.arrayBuffer())
    res.send(buffer)
  } catch (error) {
    res.status(500).json({ message: 'Proxy error', error: (error as Error).message })
  }
} 