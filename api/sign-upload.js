import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { folder } = req.body || {};

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || 'yvo7dzmz';
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY || '479641136355382';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || 'cru6sQMUJ3hzoLoDqh9nVJw0ijI';

  try {
    const timestamp = Math.round(Date.now() / 1000);

    // En Cloudinary, los parámetros para la firma DEBEN estar en orden alfabético
    const strToSign = folder
      ? `folder=${folder}&timestamp=${timestamp}${apiSecret}`
      : `timestamp=${timestamp}${apiSecret}`;

    const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

    return res.status(200).json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder: folder || ''
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error generating upload signature' });
  }
}
