import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;
  const { data } = await axios.get(url as string);

  console.log(data);

  res.status(200).json(data)

}
