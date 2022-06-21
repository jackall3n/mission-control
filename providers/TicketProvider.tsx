import React, { useState } from 'react';
import qs from "querystring";
import { subMinutes } from "date-fns";

export enum APP_TYPE {
  CUSTOMER_WEB = 'customer-web',
  POLICY_ADMIN = 'policy-admin',
  // PRODUCT_API = 'product-api',
  // QUOTE_API = 'quote-api',
  // BILLING_API = 'billing-api',
  // FEATURE_API = 'feature-api',
  // POLICY_API = 'policy-api',
  // SANCTION_API = 'sanction-api',
  // DOCUMENT_API = 'document-api',
  // RATING_API = 'rating-api'
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

export type ITicket = {
  id: string;
  key: string;
  summary: string;
  type: string;
  status: string;
}

export type IRelease = {
  loading: boolean;
  tickets: ITicket[];
  fetched?: Date;
}

export type ITicketsContext = {
  releases: Record<string, IRelease>;
  onRefresh(release: string): void;
  error?: string;
};

export const TicketsContext = React.createContext<ITicketsContext>({
  releases: {},
  onRefresh() {
  }
});

export const useTickets = (release: string): [ITicket[], (release: string) => void, string | undefined] => {
  const { releases, onRefresh, error } = React.useContext(TicketsContext);

  const tickets = releases[release]?.tickets ?? [];

  return [tickets, onRefresh, error]
};

export function TicketsProvider({ children }: React.PropsWithChildren<unknown>) {
  const [error, setError] = useState<string>('Nothing to show 🤔');
  const [releases, setReleases] = useState<Record<string, IRelease>>({});

  async function getTickets(release: string) {
    const token = localStorage.getItem('API_TOKEN');

    if (!token) {
      setError('Ask @jack if you would like to authorize this browser.');
      return [];
    }

    try {
      const response = await fetch(`/api/tickets?${qs.stringify({ release })}`, {
        headers: {
          token
        }
      });

      if (!response.ok) {
        setError('Ask @jack if you would like to authorize this browser.');

        return []
      }

      const json = await response.json();

      setError(undefined);

      return json?.tickets;
    } catch (e) {
      setError(e.message);

      return [];
    }
  }

  function updateRelease(id: string, release: any) {
    setReleases(previous => ({
      ...previous,
      [id]: release
    }));
  }

  async function onRefresh(id: string) {
    const release = releases[id];

    if (release?.loading) {
      // console.log('already getting', { id, release });
      return;
    }

    if (release?.fetched > subMinutes(new Date(), 5)) {
      // console.log('fetching tickets too soon')
      return;
    }

    updateRelease(id, {
      ...release,
      loading: true
    })

    const tickets = await getTickets(id);

    updateRelease(id, {
      ...release,
      tickets,
      fetched: new Date(),
      loading: false
    })

    // console.log('refresh tickets', { id, release, tickets });
  }

  return (
    <TicketsContext.Provider value={{
      releases,
      onRefresh,
      error
    }}>
      {children}
    </TicketsContext.Provider>
  )
}

export default TicketsProvider;
