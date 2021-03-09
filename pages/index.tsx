import React from "react";
import Application from "../components/Application/Application";
import DateFormat from "../components/DateFormat/DateFormat";
import { APP_TYPE, useApplications } from "../providers/ApplicationsProvider";
import Link from "next/link";

const APPS = Object.values(APP_TYPE).map(type => ({
  id: type.toLowerCase().replace('_', '-'),
  type,
  name: type.toLowerCase().replace('_', ' ')
}));

export default function Home() {
  const { applications, lastUpdated, paused, environments } = useApplications();

  return (
    <>
      <div className="Overview-table" style={{ gridTemplateColumns: `auto repeat(${environments.length}, 1fr)` }}>
        <div className="Overview-table-header" />
        {environments.map(environment => (
          <React.Fragment key={environment}>
            <div className="Overview-table-header">
              {environment}
            </div>
          </React.Fragment>
        ))}
        {APPS.map(application => (
          <React.Fragment key={application.id}>
            <div className="Overview-table-header">
              {application.name}
            </div>
            {environments.map(environment => {
              const app = Object.values(applications).find(a => a.environment === environment && a.type === application.type);

              return (
                <React.Fragment key={environment}>
                  <Link href={{
                    query: {
                      application: application.type,
                      environment: environment
                    }
                  }}>
                    <div className="Overview-table-cell">
                      <Application application={application} environment={environment} configuration={app} />
                    </div>
                  </Link>
                </React.Fragment>
              )
            })
            }
          </React.Fragment>
        ))}
      </div>
      <footer>
        <small className="Paper">
          <b>Last updated: </b>
          <DateFormat value={lastUpdated} format="dd MMM HH:mm:ss" />
          {paused && <span> (Paused)</span>}
        </small>
      </footer>
    </>
  )
}
