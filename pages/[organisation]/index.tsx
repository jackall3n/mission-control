import React from "react";
import Dashboard from "../../components/Dashboard/Dashboard";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDocument } from "../../hooks/useDocument";

export default function Home() {
  const { query } = useRouter();
  const [organisation] = useDocument(['organisations'], query.organisation as string);

  if (!organisation) {
    return null;
  }

  return (
    <div className="flex">
      <Head>
        <title>Dashboard - {organisation.id} | houstn.io</title>
      </Head>
      <Dashboard organisation={organisation} />
    </div>
  )
}
