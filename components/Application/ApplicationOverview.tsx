import React, { useEffect } from 'react';
import Overlay from '../Overlay/Overlay';
import { CSSTransition } from 'react-transition-group'
import { useRouter } from 'next/router';
import ApplicationOverviewDetails from "./ApplicationOverviewDetails";

interface Props {
}

function ApplicationOverview({}: Props) {
  const { push, query } = useRouter();

  const id = query.application as string;
  const environment = query.environment as string;
  const organisation = query.organisation as string;

  const path = [`organisations`, organisation, 'applications', id, 'deployments'] as string[];

  const show = path.every(Boolean);

  useEffect(() => {
    if (show) {
      console.log(id, environment);
    }
  }, [show])

  return (
    <>
      <CSSTransition in={show} timeout={750} mountOnEnter classNames="ApplicationOverview" unmountOnExit>
        <div data-application={id} data-environment={environment}>
          <Overlay onClick={() => push({ pathname: organisation, query: {} })} />
          <div className="ApplicationOverview-page">
            <ApplicationOverviewDetails id={id} path={path} environment={environment} />
          </div>
        </div>
      </CSSTransition>
    </>
  )
}

export default ApplicationOverview;
