import React, { useEffect, useState } from 'react';
import { orderBy } from 'lodash';

interface Props {
  id: string;
  metadata?: any;
  environment: string;
  deployment: any;
}

const STARRED = ['NBV', 'UKO', 'UKC', "UKR"]

function ApplicationProducts({ id, metadata, deployment, environment }: Props) {
  const [products, setProducts] = useState<any[]>([]);
  const [showMore, setShowMore] = useState(false);

  const api = metadata?.api;
  const region = metadata?.region;

  useEffect(() => {
    console.log({ api, region }, id)

    if (!api || !region) {
      return
    }

    fetch(`/api/products?api=${encodeURIComponent(api)}&region=${region}`).then(async response => {
      const json = await response.json();

      console.log({ json })

      const ordered = orderBy(json, p => STARRED.indexOf(p.code), 'desc');

      setProducts(ordered);
    })

  }, [api, region]);

  const filtered = products.filter(p => showMore || STARRED.includes(p.code));
  const hasMore = products.some(p => !STARRED.includes(p.code));

  return (
    <>
      <h2>
        Products
      </h2>
      <div className="ApplicationOverview-information">
        {filtered.map(({ id, name, code, version }) => {
          return (
            <React.Fragment key={id}>
              <strong>
                <code>
                  {code} (v{version})
                </code>
              </strong>
              <span>=</span>
              <code className="url">
                <a href={`${deployment.url}/product/${id}/quote?force=true`}
                   target="_blank"
                   rel="noreferrer">{name}</a>
                {' '}
                {environment === "dev0" && (
                  <a href={`http://localhost:3000/int/product/${id}/quote?force=true`}
                     target="_blank"
                     rel="noreferrer">(local)</a>
                )}
              </code>
            </React.Fragment>
          )
        })}
      </div>

      <button className="Application-products-show-more" onClick={() => setShowMore(!showMore)} disabled={!hasMore}>
        {!showMore && 'Show more'}
        {showMore && 'Show less'}
      </button>
    </>
  )
}

export default ApplicationProducts;
