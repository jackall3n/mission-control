import React, { useState } from 'react';
import qs from 'querystring';
import { useCollection } from "../hooks/useCollection";
import { where } from 'firebase/firestore';

export enum APP_TYPE {
  CUSTOMER_WEB = 'customer-web',
  POLICY_ADMIN = 'policy-admin',
  GQL_GATEWAY = 'gql-gateway',
  // PRODUCT_API = 'product-api',
  // QUOTE_API = 'quote-api',
  // BILLING_API = 'billing-api',
  // FEATURE_API = 'feature-api',
  // POLICY_API = 'policy-api',
  // SANCTION_API = 'sanction-api',
  // DOCUMENT_API = 'document-api',
  // RATING_API = 'rating-api'
}

export interface IMetadataDetails {
  name: string;
  value: string;
  showOnDeploymentCard?: boolean;
  link?: string;
}

export interface IMetadata {
  module: string;
  region: string;
  api?: string;
  details?: IMetadataDetails[];
  environment: string;
}

export interface IApplicationBase {
  type: APP_TYPE;
  url: string;
  environment: string;
  poll: boolean;
  error?: string;
  metadata?: IMetadata;
  updated?: Date;
}

export interface ICustomerWebApplication extends IApplicationBase {
  type: APP_TYPE.CUSTOMER_WEB;
}

export interface IPolicyAdminApplication extends IApplicationBase {
  type: APP_TYPE.POLICY_ADMIN;
}

export interface IApiApplication extends IApplicationBase {
}

export type IApplication = ICustomerWebApplication | IPolicyAdminApplication | IApiApplication;

export type IRepo = {
  deployments: any[];
  modules: any[];
}

export type IApplicationsContext = {
  applications: Array<{ id: string, name?: string }>;
  fetching: boolean;
  lastUpdated?: Date;
  paused: boolean;
  environments: Array<{ id: string, name?: string }>;
  organisation: string;
}

export const ApplicationsContext = React.createContext<IApplicationsContext>({
  applications: [],
  fetching: false,
  paused: false,
  environments: [],
  organisation: ''
});

export const useApplications = () => React.useContext(ApplicationsContext);

interface Props {
  organisation: string;
}

export function ApplicationsProvider({ children, organisation }: React.PropsWithChildren<Props>) {
  const [applications] = useCollection(['organisations', organisation, 'applications'], where('active', '==', true));
  const [environments] = useCollection(['organisations', organisation, 'environments']);

  const [paused, setPaused] = useState<boolean>(false);
  const [fetching, setFetching] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  async function get(application: IApplication): Promise<IApplication> {
    if (!application.poll) {
      return application
    }

    try {
      const url = `${application.url}/metadata`;
      const response = await fetch(`/api/load?${qs.stringify({ url })}`);

      const metadata = await response.json();

      console.log(application, { metadata });

      if (metadata.error) {
        throw new Error("Failed to get application")
      }

      return {
        ...application,
        error: undefined,
        metadata,
        updated: new Date()
      }
    } catch (error) {
      console.error(error);

      return {
        ...application,
        error: error.message,
        updated: new Date()
      }
    } finally {
      console.groupEnd();
    }
  }

  async function handle(app) {
    console.groupCollapsed(app.url);
    console.log(app.configuration);
    console.groupEnd();

    const failed = Boolean(Object.values(app.configuration ?? {}).length === 0);

    // setApps(apps => ({
    //   ...apps,
    //   [app.url]: {
    //     ...app,
    //     failed,
    //   }
    // }))

    setLastUpdated(new Date());
  }

  async function refresh() {
    console.log("REFRESHING");

    for (const application of applications) {
      // get(application)
      //   .then(handle)
    }

    setFetching(false);

    console.log("DONE");
  }


  // useEffect(() => {
  //   refresh().then();
  //   let interval = setInterval(refresh, 5000);
  //
  //   function onFocus() {
  //     if (!interval) {
  //       refresh().then();
  //       interval = setInterval(refresh, 5000);
  //       setPaused(false);
  //     }
  //   }
  //
  //   function onBlur() {
  //     if (interval) {
  //       clearInterval(interval);
  //       interval = undefined;
  //       setPaused(true);
  //     }
  //   }
  //
  //   window.addEventListener('focus', onFocus);
  //   window.addEventListener('blur', onBlur);
  //
  //   return () => {
  //     clearInterval(interval);
  //     window.removeEventListener('focus', onFocus);
  //     window.removeEventListener('blur', onBlur);
  //   }
  //
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <ApplicationsContext.Provider value={{
      applications,
      fetching,
      lastUpdated,
      paused,
      environments,
      organisation,
    }}>
      {children}
    </ApplicationsContext.Provider>
  )
}

export default ApplicationsProvider;
