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
      <h1>
        <svg xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 24 24">
          <path
            d="M3.732 13h1.504s2.32-8.403 2.799-10.263c.156-.605.646-.738.965-.737.319.001.826.224.947.74.581 2.466 3.11 13.908 3.11 13.908s1.597-6.441 1.943-7.891c.101-.425.536-.757 1-.757.464 0 .865.343 1 .707.312.841 1.675 4.287 1.677 4.293h1.591c.346-.598.992-1 1.732-1 1.104 0 2 .896 2 2s-.896 2-2 2c-.741 0-1.388-.404-1.734-1.003-.939-.001-1.856 0-2.266.003-.503.004-.774-.289-.928-.629l-.852-2.128s-1.828 7.367-2.25 8.999c-.153.595-.646.762-.97.758-.324-.004-.847-.198-.976-.783-.549-2.487-2.081-9.369-3.123-14.053 0 0-1.555 5.764-1.936 7.099-.13.454-.431.731-.965.737h-2.268c-.346.598-.992 1-1.732 1-1.104 0-2-.896-2-2s.896-2 2-2c.74 0 1.386.402 1.732 1z" />
        </svg>
        <span>Dashboard</span>
      </h1>
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
                        <div className={styles.application_environment} data-failed={application?.failed}>{environment}</div>
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
