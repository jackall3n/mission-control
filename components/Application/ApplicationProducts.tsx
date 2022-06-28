import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { orderBy } from 'lodash';
import { ExternalLinkIcon, StarIcon } from '@heroicons/react/outline'
import { StarIcon as FullStarIcon } from '@heroicons/react/solid'
import axios from 'axios'
import useSWR from 'swr'

interface Props {
  id: string;
  metadata?: any;
  environment: string;
  deployment: any;
}

const STARRED = ['NBV', "UKO", "UKR", "UKC", "UKA"];

function useProducts({ api, region }) {
  const { data: products, isValidating } = useSWR('/products', async () => {
    const { data } = await axios.get(`/api/products`, {
      params: {
        api,
        region
      }
    });

    return data;
  })

  return [products, isValidating];
}

function ApplicationProducts({ id, metadata, deployment, environment }: Props) {
  const [showMore, setShowMore] = useState(false);
  const [starred, setStarred] = useState(STARRED);

  const api = metadata?.api;
  const region = metadata?.region;

  const [products = [], loading] = useProducts({ api, region });

  function toggleStar(event: MouseEvent<HTMLButtonElement>, code: string) {
    event.preventDefault();
    event.stopPropagation();

    if (starred.includes(code)) {
      setStarred(starred.filter(s => s !== code));
    } else {
      setStarred([...starred, code]);
    }
  }

  useEffect(() => {
    console.log({ api, region }, id)

    if (!api || !region) {
      return
    }
  }, [api, region]);

  const { filtered, hasMore } = useMemo(() => {
    const mapped = products.map((product) => ({
      ...product,
      starred: starred.includes(product.code)
    }))

    const ordered = orderBy(mapped, [p => p.starred, p => p.name, p => p.version], ['desc', 'asc', 'desc']);
    const filtered = ordered.filter(p => showMore || p.starred);
    const hasMore = ordered.some(p => !p.starred);

    return {
      filtered,
      hasMore
    }
  }, [products, showMore, starred])

  return (
    <>
      <h2 className="products-title">
        <span>Products</span>

        {loading && (
          <div className="products-loader">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
      </h2>

      <div className="products">
        {filtered.map(({ id, name, code, version, starred }) => {
          return (
            <a href={`${deployment.url}/product/${id}/quote?force=true`}
               target="_blank"
               rel="noreferrer" className="product" key={id}>
              <div className="product-header">
                <button className="product-star-button" onClick={(event) => toggleStar(event, code)}>
                  {starred
                    ? <FullStarIcon className="product-star" data-full={true} />
                    : <StarIcon className="product-star" />
                  }
                </button>
                <div className="product-code">
                  {code} <ExternalLinkIcon className="product-link" />
                </div>
                <div className="product-version">v{version}</div>
              </div>
              <div className="product-name">{name}</div>


              {environment === "dev0" &&
                  <div className="product-footer">
                      <a href={`http://localhost:3000/int/product/${id}/quote?force=true`}
                         target="_blank"
                         className="product-local"
                         rel="noreferrer">
                          <span>local</span>
                          <ExternalLinkIcon className="product-link" />
                      </a>
                  </div>
              }

            </a>
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
