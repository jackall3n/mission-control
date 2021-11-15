import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function Authorize() {
  const router = useRouter();

  useEffect(() => {
    if (router.query.token) {
      localStorage.setItem('API_TOKEN', router.query.token as string);

      router.push('/')
    }

  }, [router.query])

  return (
    <div />
  )
}
