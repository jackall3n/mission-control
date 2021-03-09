import React from 'react';
import { APP_TYPE, IApplication } from "../../providers/ApplicationsProvider";
import LinkIcon from "../Icons/LinkIcon";
import ApplicationProducts from './ApplicationProducts';

interface Props {
  application: IApplication;
}

function ApplicationOverviewDetails({ application }: Props) {
  const { type, environment } = application;

  const githubUrl = `https://github.com/Inshur/inshur-${type}/releases/tag/${application?.configuration?.version}`;
  const iacUrl = `https://github.com/Inshur/inshur-iac/tree/master/module/app/${type}/${application?.configuration?.moduleVersion}/values/${environment}.yaml`;
  const stepsUrl = `https://github.com/Inshur/inshur-${type}-steps/releases/tag/${application.configuration?.steps?.version}`;
  const translationsUrl = `https://github.com/Inshur/inshur-translations/releases/tag/${application.configuration?.translations?.version}`;
  const documentsUrl = `https://github.com/Inshur/inshur-${type}-docs/releases/tag/${application.configuration?.documents?.version}`;

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
          <strong>Release</strong>
          <span>=</span>
          <code>
            <a href={iacUrl} target="_blank">{application.type}-{application.configuration?.moduleVersion}</a>
          </code>
        </div>
        <div>
          <strong>Image</strong>
          <span>=</span>
          <code>
            <a href={githubUrl} target="_blank">{application.configuration?.version}</a>
          </code>
        </div>
        {application.type === APP_TYPE.CUSTOMER_WEB && (
          <>
            <div>
              <strong>Steps</strong>
              <span>=</span>
              <code>
                <a href={stepsUrl} target="_blank">{application.configuration?.steps?.version}</a>
              </code>
            </div>
            <div>
              <strong>Translations</strong>
              <span>=</span>
              <code>
                <a href={translationsUrl} target="_blank">{application.configuration?.translations?.version}</a>
              </code>
            </div>
            <div>
              <strong>Documents</strong>
              <span>=</span>
              <code>
                <a href={documentsUrl} target="_blank">{application.configuration?.documents?.version}</a>
              </code>
            </div>
          </>
        )}
      </div>

      {type === APP_TYPE.CUSTOMER_WEB && <ApplicationProducts application={application} />}
    </>
  )
}

export default ApplicationOverviewDetails;
