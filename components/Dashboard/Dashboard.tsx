import React from 'react';
import Link from "next/link";
import styles from './Dashboard.module.scss';
import { APP_TYPE, useApplications } from "../../providers/ApplicationsProvider";
import Application from '../Application/Application';

const APPS = [{
  id: 'customer-web',
  type: APP_TYPE.CUSTOMER_WEB,
  name: 'Customer Web'
}, {
  id: 'policy-admin',
  type: APP_TYPE.POLICY_ADMIN,
  name: 'Policy Admin'
}]

function Dashboard() {
  const { applications, lastUpdated, paused, environments } = useApplications();

  return (
    <div className={styles.page}>
      <h1>Dashboard</h1>
      <div className={styles.container} style={{ gridTemplateColumns: `repeat(${environments.length}, 1fr)` }}>

        {/* ENVIRONMENTS */}
        <div className={styles.environments}>
          {environments.map(environment => (
            <div key={environment} className={styles.environment} data-environment={environment}>{environment}</div>
          ))}
        </div>

        {/* APPLICATIONS */}
        {APPS.map(app => (
          <div className={styles.application_row} key={app.id}>
            <div className={styles.application_header}>
              {app.name}
            </div>
            <div className={styles.application_environments}>
              {environments.map(environment => {
                const application = Object.values(applications).find(a => a.environment === environment && a.type === app.type);

                return (
                  <React.Fragment key={environment}>
                    <Link href={{
                      query: {
                        application: app.type,
                        environment: environment
                      }
                    }}>
                      <div className={styles.application} data-environment={environment}>
                        <div className={styles.application_environment}>{environment}</div>
                        <Application application={app} environment={environment} configuration={application} />
                      </div>
                    </Link>
                  </React.Fragment>
                )
              })
              }
            </div>
            <div className={styles.application_row_spacer} />
          </div>
        ))}

      </div>
    </div>
  )
}

export default Dashboard;
