import React, { useEffect, useState } from 'react';
import qs from 'querystring';

export enum APP_TYPE {
  CUSTOMER_WEB = 'customer-web',
  POLICY_ADMIN = 'policy-admin',
  // PRODUCT_API = 'PRODUCT_API',
  // QUOTE_API = 'QUOTE_API',
  // BILLING_API = 'BILLING_API',
  // FEATURE_API = 'FEATURE_API',
  // POLICY_API = 'POLICY_API',
  // SANCTION_API = 'SANCTION_API',
  // DOCUMENT_API = 'DOCUMENT_API',
  // RATING_API = 'RATING_API'
}

export interface IApplicationBase {
  type: APP_TYPE;
  url: string;
  environment: string;
  poll: boolean;
  failed: boolean;
}

export interface ICustomerWebApplication extends IApplicationBase {
  type: APP_TYPE.CUSTOMER_WEB;
  configuration: ICustomerWebConfiguration;
}

export interface IPolicyAdminApplication extends IApplicationBase {
  type: APP_TYPE.POLICY_ADMIN;
  configuration: IPolicyAdminConfiguration
}

export interface IApiApplication extends IApplicationBase {
  configuration?: any;
}

export type IApplication = ICustomerWebApplication | IPolicyAdminApplication | IApiApplication;

export type IRepo = {
  deployments: any[];
  modules: any[];
}

export type ICustomerWebConfiguration = {
  environment: string;
  version: string;
  moduleVersion?: string;
  startupDate: string;
  buildDate: string;
  steps: {
    version: string;
  };
  translations: {
    version: string;
  };
  documents: {
    version: string;
  }
}

export type IPolicyAdminConfiguration = {
  environment: string;
  version: string;
  moduleVersion?: string;
  startupDate: string;
  buildDate: string;
  steps: {
    version: string;
  };
  translations: {
    version: string;
  };
  documents: {
    version: string;
  }
}

export type IApplicationsContext = {
  applications: Record<string, IApplication>;
  fetching: boolean;
  lastUpdated?: Date;
  paused: boolean;
  repo: IRepo;
  environments: string[];
}

export const ApplicationsContext = React.createContext<IApplicationsContext>({
  applications: {},
  fetching: false,
  paused: false,
  repo: {
    deployments: [],
    modules: []
  },
  environments: []
});

export const useApplications = () => React.useContext(ApplicationsContext);

export const useApplication = (application: APP_TYPE, environment: string) => {
  const { applications } = useApplications();

  return Object.values(applications).find(a => a.type === application && a.environment === environment);
};

interface Props {
  applications: IApplication[];
  environments: string[];
}

export function ApplicationsProvider({ applications, children, environments }: React.PropsWithChildren<Props>) {
  const [repo, setRepo] = useState<IRepo>({ deployments: [], modules: [] });
  const [apps, setApps] = useState<Record<string, IApplication>>(() => {
    return applications.reduce((apps, a) => ({
      [a.url]: a,
      ...apps
    }), {})
  });
  const [paused, setPaused] = useState<boolean>(false);
  const [fetching, setFetching] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  async function get(application: IApplication): Promise<IApplication> {
    if (!application.poll) {
      return application
    }

    try {
      const url = `${application.url}/configuration.json`;
      const response = await fetch(`/api/load?${qs.stringify({ url })}`);

      const configuration = await response.json();

      return {
        ...application,
        configuration
      }
    } catch (error) {
      console.error(error);

      return {
        ...application,
        configuration: {} as any
      }
    } finally {
      console.groupEnd();
    }
  }

  async function handle(app) {
    console.groupCollapsed(app.url);
    console.log(app.configuration);
    console.groupEnd();

    const failed = Boolean(Object.values(app.configuration).length === 0);

    setApps(apps => ({
      ...apps,
      [app.url]: {
        ...app,
        failed,
      }
    }))

    setLastUpdated(new Date());
  }

  async function refresh() {
    console.log("REFRESHING");

    for (const application of applications) {
      get(application)
        .then(handle)
    }

    setFetching(false);

    console.log("DONE");
  }


  useEffect(() => {
    refresh().then();
    let interval = setInterval(refresh, 5000);

    function onFocus() {
      if (!interval) {
        refresh().then();
        interval = setInterval(refresh, 5000);
        setPaused(false);
      }
    }

    function onBlur() {
      if (interval) {
        clearInterval(interval);
        interval = undefined;
        setPaused(true);
      }
    }

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ApplicationsContext.Provider value={{
      applications: apps,
      fetching,
      lastUpdated,
      paused,
      repo,
      environments,
    }}>
      {children}
    </ApplicationsContext.Provider>
  )
}

export default ApplicationsProvider;
