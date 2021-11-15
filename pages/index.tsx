import React from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import Head from "next/head";

export default function Home() {
  return (
    <div className="flex">
      <Head>
        <title>Dashboard | Houstn</title>
      </Head>
      <Dashboard />
    </div>
  )
}
