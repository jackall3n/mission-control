import React from 'react';
import { APP_TYPE, IApplication, useApplications } from "../../providers/ApplicationsProvider";
import DateFormat from "../DateFormat/DateFormat";
import ReactMarkdown from "react-markdown";
import visit from 'unist-util-visit';
import { Node, Parent } from "unist";

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

  if (configuration?.failed) {
    return (
      <a className="Application failed" href={url} target="_blank">
        <h2 className="Application-version">Error</h2>
      </a>
    )
  }

  if (application.type === APP_TYPE.CUSTOMER_WEB && configuration?.configuration) {
    const { version, startupDate, steps, translations, documents, moduleVersion } = configuration.configuration;
    const deployment = repo.deployments.find(d => d.id === `${id}/${environment}`);
    const module = repo.modules.find(d => d.id === deployment?.module);

    const githubUrl = `https://github.com/Inshur/inshur-${id}/releases/tag/${version}`;
    const stepsUrl = `https://github.com/Inshur/inshur-${id}-steps/releases/tag/${steps.version}`;
    const translationsUrl = `https://github.com/Inshur/inshur-translations/releases/tag/${translations.version}`;
    const documentsUrl = `https://github.com/Inshur/inshur-${id}-docs/releases/tag/${documents.version}`;

    return (
      <a className="Application" href={url} target="_blank">
        <h2 className="Application-version">{moduleVersion ?? module?.version ?? "(not provided)"}</h2>
        <sub><DateFormat value={startupDate} format="dd MMM HH:mm" /></sub>
        <small>Image: <a target="_blank" href={githubUrl}>{version}</a></small>
        <small>Steps: <a target="_blank" href={stepsUrl}>{steps.version}</a></small>
        <small>Translations: <a target="_blank" href={translationsUrl}>{translations.version}</a></small>
        <small>Documents: <a target="_blank" href={documentsUrl}>{documents.version}</a></small>
      </a>
    )
  }

  if (application.type === APP_TYPE.POLICY_ADMIN && configuration?.configuration) {
    const { version, startupDate, moduleVersion } = configuration.configuration;
    const deployment = repo.deployments.find(d => d.id === `${id}/${environment}`);
    const module = repo.modules.find(d => d.id === deployment?.module);
    const githubUrl = `https://github.com/Inshur/inshur-${id}/releases/tag/${version}`;

    return (
      <a className="Application" href={url} target="_blank">
        <h2 className="Application-version">{moduleVersion ?? module?.version ?? "(not provided)"}</h2>
        <sub><DateFormat value={startupDate} format="dd MMM HH:mm" /></sub>
        <small>Image: <a target="_blank" href={githubUrl}>{version}</a></small>
      </a>
    )
  }

  const deployment = repo.deployments.find(d => d.id === `${id}/${environment}`);
  const module = repo.modules.find(d => d.id === deployment?.module);
  const githubUrl = `https://github.com/Inshur/inshur-${id}/releases/tag/${module?.tag}`;

  if (!module) {
    return (<a className="Application empty" href={url}>-</a>);
  }

  return (
    <a className="Application" href={url} target="_blank">
      <h2 className="Application-version">{module?.version ?? "(not provided)"}</h2>
      <small>Image: <a target="_blank" href={githubUrl}>{module?.tag}</a></small>
      {module?.readme && (
        <div className="Application-description">
          <ReactMarkdown>
            {module.readme}
          </ReactMarkdown>
        </div>
      )}
    </a>
  )
}

function jira(options: any) {
  function transformer(tree: Node, file) {
    visit(tree, 'text', visitor);
  }

  function visitor(node: Node, index: number, parent: Parent) {
    const value = node.value as string;
    const children = [];

    console.log(node.type);

    if (!/([A-Z]+-[0-9]+)/g.test(value)) {
      // return [visit.CONTINUE, index];
    }
    // return [visit.CONTINUE, index];

    // const replacement = {
    //   children: []
    // }

    for (const word of value.split(/([A-Z]+-[0-9]+)/g)) {
      // if (/([A-Z]+-[0-9]+)/g.test(word)) {
      //   console.log(word);
      //   children.push({
      //     type: 'link',
      //     url: 'google.com',
      //     title: word
      //   })
      // } else {
      //   console.log(word);
      //   children.push({
      //     type: 'text',
      //     value: word
      //   })
      // }
    }

    // node.children =  children;
    //
    // (parent.children as any)[index] = {
    //   type: 'link',
    //   children
    // }

    // return [visit.SKIP, index]


    //
    // parent.children[index] =
    //
    //   // console.log(/([A-Z]+-[0-9]+)/.exec(node.value as string))
    //
    //   node.children = children
  }

  return transformer;
}

export default Application;
