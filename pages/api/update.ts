import { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios";
import redis from "../../redis/client";
import admin from '../../firebase/admin';

export default async ({ query }: NextApiRequest, response: NextApiResponse) => {
  const { id, url, application, organisation } = query;
  const key = `${organisation}:${application}:${id}`;

  if (!url) {
    return response.json({ error: 'No url' })
  }

  try {
    const result = await get(key, url as string);

    const cached = await redis.get(key);

    // If cached, just return
    if (JSON.stringify(result) === cached && !query.flush) {
      console.info("~", key, url, result.error)
      return response.json(result)
    }

    console.info("+", key, url, result.error)

    await redis.set(key, JSON.stringify(result), { EX: 60 /*seconds*/ * 5 /*minutes*/ });

    await admin.firestore().doc(`organisations/${organisation}/applications/${application}/deployments/${id}/public/metadata`).set({
        ...result,
        updated: new Date()
      },
      {
        merge: result.error
      });

    if (query.flush) {
      await admin.firestore().doc(`organisations/${organisation}/applications/${application}/deployments/${id}`).set({
        flush: null,
      }, { merge: true });
    }

    response.json(result)
  } catch (e) {
    response.status(500).json({ error: true, message: e.message })
  }
}

export async function get(key: string, url: string) {
  try {
    const { data } = await axios.get("metadata", {
      baseURL: url
    });

    if (typeof data !== 'object') {
      console.warn(key, data)

      return {
        error: 'Invalid response',
      }
    }

    return { ...data, url, error: null }
  } catch (e) {
    return {
      error: e.message
    }
  }
}
