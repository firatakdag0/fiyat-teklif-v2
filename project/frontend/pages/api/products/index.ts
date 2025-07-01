import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Backend API URL'ini ayarlayın
  const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
  try {
    const response = await fetch(`${backendUrl}/api/products`, {
      headers: {
        'Accept': 'application/json',
        // Gerekirse auth header ekleyin
      },
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Backendden ürünler alınamadı' });
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
} 