import React from 'react';
import Link from "next/link";
import styles from './Dashboard.module.scss';
import { APP_TYPE, useApplications } from "../../providers/ApplicationsProvider";
import Application from '../Application/Application';

const APPS = Object.values(APP_TYPE).map(type => ({
  id: type,
  name: type.replace('-', ' '),
  type
}))

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
              <span>{app.name}</span>
              {/*<div className={styles.application_header_star}>*/}
              {/*  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">*/}
              {/*    <path*/}
              {/*      d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z" />*/}
              {/*  </svg>*/}
              {/*</div>*/}
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
                      <div className={styles.application}
                           data-environment={environment}
                           data-failed={application?.failed}>
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
