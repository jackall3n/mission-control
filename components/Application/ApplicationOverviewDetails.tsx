import React from 'react';
import { APP_TYPE } from "../../providers/ApplicationsProvider";
import { useTickets } from "../../providers/TicketProvider";
import { LinkIcon } from "@heroicons/react/outline";
import ApplicationProducts from './ApplicationProducts';
import { useDocument } from "../../hooks/useDocument";

interface Props {
  id: string;
  path: string | string[];
  environment: string;
}

function getImage(type) {
  switch (type) {
    case "STORY":
      return 'https://inshur.atlassian.net/secure/viewavatar?size=medium&avatarId=10315&avatarType=issuetype';
    case "TASK":
      return 'https://inshur.atlassian.net/secure/viewavatar?size=medium&avatarId=10318&avatarType=issuetype';
    case "BUG":
      return 'https://inshur.atlassian.net/secure/viewavatar?size=medium&avatarId=10303&avatarType=issuetype';
    case "STORY_BUG":
      return 'https://inshur.atlassian.net/secure/viewavatar?size=medium&avatarId=10323&avatarType=issuetype';
    case "EPIC":
      return 'https://inshur.atlassian.net/images/icons/issuetypes/epic.svg';
    case "SUB_TASK":
      return 'https://inshur.atlassian.net/secure/viewavatar?size=medium&avatarId=10610&avatarType=issuetype';
    case "FEATURE":
      return 'https://inshur.atlassian.net/secure/viewavatar?size=medium&avatarId=10300&avatarType=issuetype';
  }

  return type;
}

function ApplicationOverviewDetails({ id, environment, path }: Props) {
  const [deployment] = useDocument<any>(path, environment);
  const [metadata] = useDocument<any>([path, environment, 'public'], 'metadata');

  const iacUrl = `https://github.com/Inshur/inshur-iac/tree/master/module/app/${id}/${metadata?.module}/values/${environment}.yaml`;

  const release = `${id}-${metadata?.module}`;
  const [tickets, , error] = useTickets(release);

  if (!deployment || !metadata) {
    return null;
  }

  const _id = deployment.ref.parent.parent.id;
  const _environment = deployment.ref.id;

  return (
    <>
      <h1>
        <a href={deployment.url} target="_blank" rel="noreferrer noopener">{_id} ({_environment}) <LinkIcon /></a>
      </h1>
      <div className="ApplicationOverview-information">
        <div>
          <strong>Url</strong>
          <span>=</span>
          <code className="url">
            <a href={deployment.url} target="_blank" rel="noreferrer noopener">{deployment.url}</a>
          </code>
        </div>
        <div>
          <strong>Module</strong>
          <span>=</span>
          <code>
            <a href={iacUrl} target="_blank" rel="noreferrer noopener">{_id}-{metadata?.module}</a>
          </code>
        </div>

        {metadata?.details.map((detail, index) => (
          <div key={index}>
            <strong>{detail.name}</strong>
            <span>=</span>
            <code>
              <a href={detail.link} target="_blank" rel="noreferrer noopener">{detail.value}</a>
            </code>
          </div>
        ))}
      </div>

      <div className="ApplicationOverview-tickets">
        <h2>
          <a href={`https://inshur.atlassian.net/issues/?jql=fixVersion%20%3D%20${release}`} target="_blank"
             rel="noreferrer">Tickets <LinkIcon /></a>
        </h2>

        <div className="ApplicationOverview-tickets-list">

          {error && (
            <div className="ApplicationOverview-tickets-error">
              {error}
            </div>
          )}

          {!error && tickets.map(({ id, summary, key, type, status }) => {

            const status_enum = status.toUpperCase().replaceAll('  ', ' ').replaceAll(' ', '_');
            const _status = status_enum === 'READY_FOR_REGRESSION_TESTING' ? 'Ready for regression' : status;

            return (
              <div key={id} className="ApplicationOverview-tickets-ticket">
                <img width={16} height={16} src={getImage(type)} alt={type} />
                <div className="ApplicationOverview-tickets-ticket-key">
                  <a href={`https://inshur.atlassian.net/browse/${key}`} target="_blank" rel="noreferrer noopener">
                    {key}
                  </a>
                </div>
                <div className="ApplicationOverview-tickets-ticket-summary">
                  <a href={`https://inshur.atlassian.net/browse/${key}`} target="_blank" rel="noreferrer noopener">
                    {summary}
                  </a>
                </div>
                <div className="ApplicationOverview-tickets-ticket-status" data-status={status_enum}>{_status}</div>
              </div>
            )
          })}

        </div>
      </div>

      {_id === APP_TYPE.CUSTOMER_WEB &&
          <ApplicationProducts
              id={_id}
              metadata={metadata}
              environment={_environment}
              deployment={deployment}
          />}
    </>
  )
}

export default ApplicationOverviewDetails;
