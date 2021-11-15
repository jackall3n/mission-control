import React from 'react';
import styles from './Dashboard.module.scss';
import { APP_TYPE, useApplications } from "../../providers/ApplicationsProvider";
import { groupBy } from 'lodash';
import Link from 'next/link';
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
        {/* APPLICATIONS */}
        {APPS.map(app => (
          <div className={styles.application_row} key={app.id}>
            <div className={styles.application_header}>
              <span>{app.name}</span>
            </div>
            <div className={styles.application_environments}>
              {Object.entries(groupBy(environments, e => {
                if (e === "prod0") {
                  return e;
                }

                return e.replace(/[^A-Za-z]/gmi, '');
              })).map(([environmentType, environments]) => {

                return (
                  <div data-environment-type={environmentType} key={environmentType}
                       className={styles.environment_type}
                       style={{
                         gridColumn: `span ${environments.length}`,
                         gridTemplateColumns: `repeat(${environments.length}, 1fr)`
                       }}
                  >
                    <>
                      {environments.map((environment, index) => {
                        const application = Object.values(applications).find(a => a.environment === environment && a.type === app.type);

                        return (
                          <React.Fragment key={environment}>
                            <Link scroll={false} href={{
                              query: {
                                application: app.type,
                                environment: environment
                              }
                            }}>
                              <div className={styles.application}
                                   data-environment={environment}
                                   data-environment-type={environment.replace(/[^A-Za-z]/gmi, '')}
                                   data-environment-sub={!environment.includes('0') && environment !== 'prod1'}
                                   data-failed={!!application?.error}
                                   style={{
                                     transform: `translate(${index * 0.325}rem, ${index * 0.325}rem)`,
                                     zIndex: 5 - index
                                   }}
                              >
                                <div className={styles.application_environment}
                                     data-failed={!!application?.error}>{environment}</div>
                                <Application application={app} environment={environment} configuration={application} />
                              </div>
                            </Link>
                          </React.Fragment>
                        )
                      })}
                    </>
                  </div>
                )
              })}
            </div>
            <div className={styles.application_row_spacer} />
          </div>
        ))}

      </div>
    </div>
  )
}

{/*{environments.map(environment => {*/
}
{/*  const application = Object.values(applications).find(a => a.environment === environment && a.type === app.type);*/
}

{/*  return (*/
}
{/*    <React.Fragment key={environment}>*/
}
{/*      <Link href={{*/
}
{/*        query: {*/
}
{/*          application: app.type,*/
}
{/*          environment: environment*/
}
{/*        }*/
}
{/*      }}>*/
}
{/*        <div className={styles.application}*/
}
{/*             data-environment={environment}*/
}
{/*             data-environment-type={environment.replace(/[^A-Za-z]/gmi, '')}*/
}
{/*             data-environment-sub={!environment.includes('0')}*/
}
{/*             data-failed={application?.failed}>*/
}
{/*          <div className={styles.application_environment}*/
}
{/*               data-failed={application?.failed}>{environment}</div>*/
}
{/*          <Application application={app} environment={environment} configuration={application} />*/
}
{/*        </div>*/
}
{/*      </Link>*/
}
{/*    </React.Fragment>*/
}
{/*  )*/
}
{/*})*/
}

export default Dashboard;
