import React, { useEffect, useState } from 'react';
import { IApplication } from "../../providers/ApplicationsProvider";

interface Props {
  application: IApplication;
}

function ApplicationProducts({ application }: Props) {
  const { type, environment } = application;
  const [products, setProducts] = useState<any[]>([]);

  const api = application?.configuration?.api?.base ?? application?.configuration?.api;
  const region = application?.configuration?.region;

  useEffect(() => {
    console.log({ api, region }, application)

    if (!api || !region) {
      return
    }

    fetch(`/api/products?api=${encodeURIComponent(api)}&region=${region}`).then(async response => {
      const json = await response.json();

      console.log({ json })

      setProducts(json);
    })

  }, [api, region])

  return (
    <>
      <h1>
        Products
      </h1>
      <div className="ApplicationOverview-information">
        {products.map(({ id, name, code, version }) => {
          const description = name.length > 25 ? `${name.substring(0, 26)}...` : name;

          return (
            <div key={id}>
              <strong>
                <code>
                  {code} (v{version})
                </code>
              </strong>
              <span>=</span>
              <code className="url">
                <a href={`${application.url}/product/${id}/quote`}
                   target="_blank"
                   rel="noreferrer">{description}</a>
              </code>
            </div>
          )
        })}

      </div>
    </>
  )
}

export default ApplicationProducts;
