import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {

  try {
    const { url } = req.query;
    const { data } = await axios.get(url as string);

    res.status(200).json(data)

  } catch (e) {
    res.status(500).json({ error: true, message: e.message })
  }
}
