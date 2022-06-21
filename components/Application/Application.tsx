import React from 'react';
import { TicketIcon } from '@heroicons/react/outline'
import { useTickets } from "../../providers/TicketProvider";
import DateFormat from '../DateFormat/DateFormat';
import { useDocument } from "../../hooks/useDocument";
import styles from "../Dashboard/Dashboard.module.scss";
import Link from 'next/link';

interface Props {
  index: number
  path: string;
  organisation: string;
  application: {
    id: string;
    name: string;
  };
  environment: { id: string };
}

function Application({ path, organisation, application, environment, index }: Props) {
  const [deployment] = useDocument<any>(path, environment.id);
  const [metadata] = useDocument<any>([path, environment.id, 'public'], 'metadata');

  const url = deployment?.url || '#';

  const [tickets, onRefresh] = useTickets(`${application.id}-${metadata?.module}`);

  return (
    <Link scroll={false} href={{
      pathname: organisation,
      query: {
        application: application.id,
        environment: environment.id
      }
    }}>
      <div className={styles.application}
           data-environment={environment.id}
           data-empty={!deployment}
           data-environment-type={environment.id.replace(/[^A-Za-z]/gmi, '')}
           data-environment-sub={!environment.id.includes('0') && environment.id !== 'prod1'}
           data-failed={!!metadata?.error}
           style={{
             transform: `translate(${index * 0.325}rem, ${index * 0.325}rem)`,
             zIndex: 5 - index
           }}
      >
        <div className={styles.application_environment} data-failed={!!metadata?.error}>{environment.id}</div>
        <ApplicationContent metadata={metadata} url={url} tickets={tickets} />
      </div>
    </Link>
  )
}

function ApplicationContent({ metadata, url, tickets }) {
  if (!metadata) {
    return (<a className="Application empty" href={url}>-</a>);
  }

  const { error, module, updated, details } = metadata;

  return (
    <a className="Application" data-error={!!error} href={url} target="_blank" rel="noreferrer noopener">
      <sub><DateFormat value={updated?.toDate()} format="dd MMM, HH:mm" /></sub>
      <h2 className="Application-version">
        <div>
          {module ?? "(not provided)"}
        </div>

        <div className="Application-actions">
          <div className="Application-actions-tickets">
            <TicketIcon className="Application-actions-tickets-icon" />
            <div className="Application-actions-tickets-count">{tickets?.length ?? '-'}</div>
          </div>
        </div>
      </h2>
      {details?.filter(d => d.showOnDeploymentCard === undefined || d.showOnDeploymentCard).map((detail, index) => (
        <small key={index}>{detail.name}: <a target="_blank" rel="noreferrer noopener" href={detail.link}>{detail.value}</a></small>
      ))}
    </a>
  )
}

export default Application;
