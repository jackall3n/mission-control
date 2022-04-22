import React, { useEffect, useState } from 'react';
import ApplicationsProvider, { APP_TYPE, IApplication } from "../providers/ApplicationsProvider";
import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics, logEvent } from "firebase/analytics";

import '../styles/globals.scss';
import { useRouter } from "next/router";
import Head from "next/head";
import ApplicationOverview from "../components/Application/ApplicationOverview";
import Header from '../components/Header/Header';
import Menu from '../components/Menu/Menu';
import TicketsProvider from "../providers/TicketProvider";
import ThemeProvider from "../providers/ThemeProvider";

const firebaseConfig = {
  apiKey: "AIzaSyB2YXgcUob-R1g_Vh_AsZ1V5nWlVmFsUhA",
  authDomain: "houstn-io.firebaseapp.com",
  projectId: "houstn-io",
  storageBucket: "houstn-io.appspot.com",
  messagingSenderId: "978691732275",
  appId: "1:978691732275:web:5e5041fcfbd14261d68446",
  measurementId: "G-FZZTVD9K5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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
  environments?: string[];
}

const apps: Record<APP_TYPE, IAppConfig> = {
  [APP_TYPE.CUSTOMER_WEB]: {
    subdomain: 'app',
    environments: ['dev0', 'prod0', 'prod1', 'prod2']
  },
  [APP_TYPE.POLICY_ADMIN]: {
    subdomain: 'admin',
    environments: ['dev0', 'prod0', 'prod1', 'prod2']
  },
  [APP_TYPE.GQL_GATEWAY]: {
    subdomain: 'api',
    path: 'gql-gateway',
    environments: ['dev0', 'prod0', 'prod1', 'prod2']
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
    if (config.environments && !config.environments.includes(environment)) {
      continue;
    }

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

function useAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAnalytics(getAnalytics(app))
    }

  }, [])

  return analytics;
}

function App({ Component }) {
  const { query } = useRouter();
  const { application, environment } = query;
  const analytics = useAnalytics();

  useEffect(() => {
    if (!analytics) {
      return;
    }

    if (!application || !environment) {
      return;
    }

    logEvent(analytics, 'view_application', {
      application,
      environment
    })
  }, [application, environment, analytics])

  return (
    <ThemeProvider>
      <TicketsProvider>
        <Head>
          <title>Houstn</title>

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Poppins:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,100&family=Press+Start+2P&family=Source+Serif+Pro:wght@300;400&display=swap"
            rel="stylesheet" />
          <link rel="icon"
                href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>" />
        </Head>
        <ApplicationsProvider applications={applications} environments={environments}>
          <Header />
          <div className="App">
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

    </ThemeProvider>
  );
}

export default App;
