import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import _ from 'lodash';

async function getProducts(api: string, region: string) {
  const products: any[] = [];

  let page = 0;
  let total = 0;

  do {
    const { data } = await axios.get(`${api}/${region}/product-api/v1.0/product-options`, {
      params: {
        size: 100,
        page
      }
    });

    total = data.page.totalElements;

    if (!data._embedded['product-options']) {
      return products;
    }

    products.push(...data._embedded['product-options']);

    page++;
  }
  while (products.length < total)

  return products;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { api, region } = req.query;
  const data = await getProducts(api as string, region as string);
  const products = data.map(({ product, name, code, requiredIdentity }) => ({
    id: product.productId,
    name,
    version: Number(product.version),
    code,
    identities: requiredIdentity
  }));

  const response = _(products).orderBy('version', 'desc').groupBy('id').map(([product]) => product).orderBy(['version', 'code'], ['desc', 'asc'])

  res.status(200).json(response)

}
