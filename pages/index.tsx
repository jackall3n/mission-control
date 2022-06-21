import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const { push } = useRouter();

  useEffect(() => {
    push('/inshur')
  }, [])

  return (
    <div className="flex">
      <Head>
        <title>Dashboard | Houstn</title>
      </Head>
    </div>
  )
}
