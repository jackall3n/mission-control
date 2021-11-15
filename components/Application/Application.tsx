import React, { useEffect } from 'react';
import { APP_TYPE, IApplication, useApplications } from "../../providers/ApplicationsProvider";
import { TicketIcon } from '@heroicons/react/outline'
import { useTickets } from "../../providers/TicketProvider";
import DateFormat from '../DateFormat/DateFormat';

interface Props {
  application: {
    id: string;
    name: string;
    type: APP_TYPE;
  };
  environment: string;
  configuration?: IApplication;
}

function Application({ application, environment, configuration }: Props) {
  const { repo } = useApplications();
  const { id } = application;
  const url = configuration?.url || '#';

  const release = `${id}-${configuration?.metadata?.module}`;
  const [tickets, onRefresh] = useTickets(release);

  useEffect(() => {
    if (!id || !configuration?.metadata?.module) {
      return;
    }

    onRefresh(release);
  }, [configuration, release, id])

  if (configuration?.error) {
    return (
      <a className="Application failed" href={url} target="_blank" title={configuration.error}>
        <h2>Error</h2>
      </a>
    )
  }

  if (!configuration?.metadata) {
    return (<a className="Application empty" href={url}>-</a>);
  }

  return (
    <a className="Application" href={url} target="_blank">
      <sub><DateFormat value={configuration?.updated} format="dd MMM, HH:mm" /></sub>
      <h2 className="Application-version">
        <div>
          {configuration?.metadata?.module ?? "(not provided)"}
        </div>

        <div className="Application-actions">
          <div className="Application-actions-tickets">
            <TicketIcon className="Application-actions-tickets-icon" />
            <div className="Application-actions-tickets-count">{tickets?.length ?? '-'}</div>
          </div>
        </div>
      </h2>
      {configuration?.metadata?.details.filter(d => d.showOnDeploymentCard === undefined || d.showOnDeploymentCard).map((detail, index) => (
        <small key={index}>{detail.name}: <a target="_blank" href={detail.link}>{detail.value}</a></small>
      ))}
    </a>
  )
}

export default Application;
