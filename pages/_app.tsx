import React from 'react';
import ApplicationsProvider, { APP_TYPE, IApplication } from "../providers/ApplicationsProvider";

import '../styles/globals.scss';
import { useRouter } from "next/router";
import Head from "next/head";
import ApplicationOverview from "../components/Application/ApplicationOverview";
import Header from '../components/Header/Header';
import Menu from '../components/Menu/Menu';
import TicketsProvider from "../providers/TicketProvider";

function createApplication(type: APP_TYPE, environment: string, url: string, poll = true): IApplication {
  return {
    type,
    url,
    environment,
    poll,
  }
}

const environments = ["dev0", "test0", "test1", "test2", "prod0", "prod1", "prod2"];

interface IAppConfig {
  subdomain: string;
  path?: string;
}

const apps: Record<APP_TYPE, IAppConfig> = {
  [APP_TYPE.CUSTOMER_WEB]: {
    subdomain: 'app'
  },
  [APP_TYPE.POLICY_ADMIN]: {
    subdomain: 'admin'
  },
  [APP_TYPE.GQL_GATEWAY]: {
    subdomain: 'api',
    path: 'gql-gateway'
  }
};

const REGIONS = {
  0: 'int',
  1: 'eu',
  2: 'uk'
}

const applications = Object.entries(apps).reduce((applications, [app, config]) => {
  const apps = [...applications];

  for (const environment of environments) {
    const index = environment.search(/\d/);
    const environmentType = environment.substring(0, index);
    const environmentNumber = environment.substring(index);
    const region = REGIONS[environmentNumber];

    if (!region) {
      continue;
    }

    const subdomain = environmentType === 'prod' ? config.subdomain : `${config.subdomain}.${environmentType}`;

    const path = config.path ? [region, config.path].join('/') : region;

    const url = `https://${subdomain}.inshur.com/${path}`;

    const application = createApplication(app as APP_TYPE, environment, url);

    apps.push(application);
  }

  return apps;
}, [])

function App({ Component }) {
  const { query } = useRouter();
  const { application, environment } = query;

  return (
    <TicketsProvider>
      <Head>
        <title>Houstn</title>
        <link rel="icon"
              href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>" />
      </Head>
      <ApplicationsProvider applications={applications} environments={environments}>
        <Header />
        <div className="App dark">
          <Menu />
          <div className="Page">
            <div className="flex">
              <Component />
            </div>
          </div>
        </div>
        {applications.map(app => (
          <ApplicationOverview
            key={`${app.environment}-${app.type}`}
            application={app.type}
            environment={app.environment}
            show={app.type === application as APP_TYPE && environment === app.environment} />
        ))}
      </ApplicationsProvider>
    </TicketsProvider>
  );
}

export default App;
