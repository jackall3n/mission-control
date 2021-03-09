import React from 'react';
import ApplicationsProvider, { APP_TYPE, IApplication } from "../providers/ApplicationsProvider";

import '../styles/globals.scss';
import { useRouter } from "next/router";
import ApplicationOverview from "../components/Application/ApplicationOverview";

function createApplication(type: APP_TYPE, environment: string, url: string, poll = true): IApplication {
  return {
    type,
    url,
    environment,
    configuration: undefined as any,
    poll,
    failed: false
  }
}

const applications = [
  createApplication(APP_TYPE.CUSTOMER_WEB, "dev0", "https://app.dev.inshur.com/int"),
  createApplication(APP_TYPE.CUSTOMER_WEB, 'test0', "https://app.test.inshur.com/int"),
  createApplication(APP_TYPE.CUSTOMER_WEB, 'test1', "https://app.test.inshur.com/eu"),
  createApplication(APP_TYPE.CUSTOMER_WEB, 'test2', "https://app.test.inshur.com/uk"),
  createApplication(APP_TYPE.CUSTOMER_WEB, 'prod0', "https://app.inshur.com/int"),
  createApplication(APP_TYPE.CUSTOMER_WEB, 'prod1', "https://app.inshur.com/eu"),
  createApplication(APP_TYPE.CUSTOMER_WEB, 'prod2', "https://app.inshur.com/uk"),

  createApplication(APP_TYPE.POLICY_ADMIN, "dev0", "https://admin.dev.inshur.com/int"),
  createApplication(APP_TYPE.POLICY_ADMIN, 'test0', "https://admin.test.inshur.com/int"),
  createApplication(APP_TYPE.POLICY_ADMIN, 'test1', "https://admin.test.inshur.com/eu"),
  createApplication(APP_TYPE.POLICY_ADMIN, 'test2', "https://admin.test.inshur.com/uk"),
  createApplication(APP_TYPE.POLICY_ADMIN, 'prod0', "https://admin.inshur.com/int"),
  createApplication(APP_TYPE.POLICY_ADMIN, 'prod1', "https://admin.inshur.com/eu"),
  createApplication(APP_TYPE.POLICY_ADMIN, 'prod2', "https://admin.inshur.com/uk"),
  //
  // createApplication(APP_TYPE.PRODUCT_API, "dev0", "https://api.dev.inshur.com/int/product-api", false),
  // createApplication(APP_TYPE.PRODUCT_API, 'test0', "https://api.test.inshur.com/int/product-api", false),
  // createApplication(APP_TYPE.PRODUCT_API, 'test1', "https://api.test.inshur.com/eu/product-api", false),
  // createApplication(APP_TYPE.PRODUCT_API, 'prod0', "https://api.inshur.com/int/product-api", false),
  // createApplication(APP_TYPE.PRODUCT_API, 'prod1', "https://api.inshur.com/eu/product-api", false),
  //
  // createApplication(APP_TYPE.QUOTE_API, "dev0", "https://api.dev.inshur.com/int/quote-api", false),
  // createApplication(APP_TYPE.QUOTE_API, 'test0', "https://api.test.inshur.com/int/quote-api", false),
  // createApplication(APP_TYPE.QUOTE_API, 'test1', "https://api.test.inshur.com/eu/quote-api", false),
  // createApplication(APP_TYPE.QUOTE_API, 'prod0', "https://api.inshur.com/int/quote-api", false),
  // createApplication(APP_TYPE.QUOTE_API, 'prod1', "https://api.inshur.com/eu/quote-api", false),
];

const environments = ["dev0", "test0", "test1", "test2", "prod0", "prod1", "prod2"];

function App({ Component }) {
  const { query } = useRouter();
  const { application, environment } = query;

  return (
    <ApplicationsProvider applications={applications} environments={environments}>
      <div className="App">
        <Component />
      </div>
      {applications.map(app => (
        <ApplicationOverview
          key={`${app.environment}-${app.type}`}
          application={app.type}
          environment={app.environment}
          show={app.type === application as APP_TYPE && environment === app.environment} />
      ))}
    </ApplicationsProvider>
  );
}

export default App;
