import React from 'react';
import { APP_TYPE, useApplication } from "../../providers/ApplicationsProvider";
import Overlay from '../Overlay/Overlay';
import { CSSTransition } from 'react-transition-group'
import { useRouter } from 'next/router';
import ApplicationOverviewDetails from "./ApplicationOverviewDetails";

interface Props {
  application: APP_TYPE;
  environment: string;
  show: boolean;
}

function ApplicationOverview({ application: type, environment, show }: Props) {
  const { push } = useRouter();
  const application = useApplication(type, environment);

  if (show) {
    console.log(application);
  }

  return (
    <>
      <CSSTransition in={show} timeout={750} mountOnEnter classNames="ApplicationOverview" unmountOnExit>
        <div data-application={type} data-environment={environment}>
          <Overlay onClick={() => push('/')} />
          <div className="ApplicationOverview-page">
            {application && (
              <ApplicationOverviewDetails application={application} />
            )}
          </div>
        </div>
      </CSSTransition>
    </>
  )
}

export default ApplicationOverview;
