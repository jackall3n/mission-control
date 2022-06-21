import { NextApiRequest, NextApiResponse } from 'next';
import admin from "../../firebase/admin";
import * as querystring from "querystring";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const deployments = admin.firestore().collectionGroup('deployments')
    .withConverter({
      toFirestore: model => model,
      fromFirestore(snapshot) {
        const application = snapshot.ref.parent.parent;
        const organisation = application.parent.parent;

        return {
          id: snapshot.id,
          organisation: organisation.id,
          application: application.id,
          ...snapshot.data(),
          updated: snapshot.data().updated?.toDate()
        }
      }
    })

  const results = await deployments.get()
  const mapped = results.docs.map(deployment => ({
    ...deployment.data(),
    update: `/api/update?${querystring.stringify(deployment.data())}`
  }))

  try {
    res.status(200).json(mapped)
  } catch (e) {
    res.status(500).json({ error: true, message: e.message })
  }
}
