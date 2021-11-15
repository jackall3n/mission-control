import React from 'react';
import { APP_TYPE, IApplication } from "../../providers/ApplicationsProvider";
import { useTickets } from "../../providers/TicketProvider";
import { LinkIcon } from "@heroicons/react/outline";
import ApplicationProducts from './ApplicationProducts';

interface Props {
  application: IApplication;
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

function ApplicationOverviewDetails({ application }: Props) {
  const { type, environment } = application;

  const iacUrl = `https://github.com/Inshur/inshur-iac/tree/master/module/app/${type}/${application?.metadata?.module}/values/${environment}.yaml`;

  const release = `${type}-${application?.metadata?.module}`;
  const [tickets, , error] = useTickets(release);

  const token = localStorage.getItem('API_TOKEN');

  return (
    <>
      <h1>
        <a href={application.url} target="_blank" rel="noreferrer">{type} ({environment}) <LinkIcon /></a>
      </h1>
      <div className="ApplicationOverview-information">
        <div>
          <strong>Url</strong>
          <span>=</span>
          <code className="url">
            <a href={application.url} target="_blank" rel="noreferrer">{application.url}</a>
          </code>
        </div>
        <div>
          <strong>Module</strong>
          <span>=</span>
          <code>
            <a href={iacUrl} target="_blank">{application.type}-{application?.metadata?.module}</a>
          </code>
        </div>

        {application?.metadata?.details.map((detail, index) => (
          <div key={index}>
            <strong>{detail.name}</strong>
            <span>=</span>
            <code>
              <a href={detail.link} target="_blank">{detail.value}</a>
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

      {type === APP_TYPE.CUSTOMER_WEB && <ApplicationProducts application={application} />}
    </>
  )
}

export default ApplicationOverviewDetails;
