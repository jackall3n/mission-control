import React from 'react';
import styles from './Dashboard.module.scss';
import { useApplications } from "../../providers/ApplicationsProvider";
import { groupBy } from 'lodash';
import Application from '../Application/Application';
import { useTheme } from "../../providers/ThemeProvider";
import { useCollection } from "../../hooks/useCollection";

function Dashboard({ organisation }) {
  const { applications, lastUpdated, paused, environments } = useApplications();

  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.page}>
      <h1 className="Page-title">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 24 24">
            <path
              d="M3.732 13h1.504s2.32-8.403 2.799-10.263c.156-.605.646-.738.965-.737.319.001.826.224.947.74.581 2.466 3.11 13.908 3.11 13.908s1.597-6.441 1.943-7.891c.101-.425.536-.757 1-.757.464 0 .865.343 1 .707.312.841 1.675 4.287 1.677 4.293h1.591c.346-.598.992-1 1.732-1 1.104 0 2 .896 2 2s-.896 2-2 2c-.741 0-1.388-.404-1.734-1.003-.939-.001-1.856 0-2.266.003-.503.004-.774-.289-.928-.629l-.852-2.128s-1.828 7.367-2.25 8.999c-.153.595-.646.762-.97.758-.324-.004-.847-.198-.976-.783-.549-2.487-2.081-9.369-3.123-14.053 0 0-1.555 5.764-1.936 7.099-.13.454-.431.731-.965.737h-2.268c-.346.598-.992 1-1.732 1-1.104 0-2-.896-2-2s.896-2 2-2c.74 0 1.386.402 1.732 1z" />
          </svg>
          <span>Dashboard</span>

        </div>
      </h1>
      <div className={styles.container} style={{ gridTemplateColumns: `repeat(${environments.length}, 1fr)` }}>
        {applications.map(application => (
          <ApplicationRow key={application.id}
                          application={application}
                          environments={environments}
                          organisation={organisation.id}
          />
        ))}
      </div>
    </div>
  )
}

function ApplicationRow({ application, environments, organisation }) {
  const { name } = application;

  const [deployments, collection] = useCollection(['organisations', organisation, 'applications', application.id, 'deployments'])

  console.log({ deployments });

  return (
    <div className={styles.application_row}>
      <div className={styles.application_header}>
        <span>{name ?? application.id}</span>
      </div>
      <div className={styles.application_environments}>
        {Object.entries(groupBy(environments, e => {
          if (e.id === "prod0") {
            return e;
          }

          return e.id.replace(/[^A-Za-z]/gmi, '');
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
                {environments.map((environment, index) => (
                  <Application index={index}
                               key={environment.id}
                               path={collection.path}
                               organisation={organisation}
                               application={application}
                               environment={environment}
                  />
                ))}
              </>
            </div>
          )
        })}
      </div>
      <div className={styles.application_row_spacer} />
    </div>
  )
}

export default Dashboard;
