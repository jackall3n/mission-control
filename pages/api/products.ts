import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import _ from 'lodash';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { api, region } = req.query;
  const { data } = await axios.get(`${api}/${region}/product-api/v1.0/product-options?size=1000`);
  const products = data._embedded['product-options'].map(({ product, name, code, requiredIdentity }) => ({
    id: product.productId,
    name,
    version: Number(product.version),
    code,
    identities: requiredIdentity
  }));

  const response = _(products).orderBy('version', 'desc').groupBy('id').map(([product]) => {
    console.log(product);

    return product;
  }).orderBy(['version', 'code'], ['desc', 'asc'])

  console.log(response);

  res.status(200).json(response)

}
