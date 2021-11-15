import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

async function getTickets(release: string) {
  const tickets: any[] = [];

  let total = 0;

  do {
    try {
      const { data } = await axios.get(`https://inshur.atlassian.net/rest/api/3/search`, {
        params: {
          maxResults: 100,
          startAt: tickets.length,
          jql: `fixVersion = ${release}`,
          fields: ['summary', 'changelog', 'key', 'created', 'issuetype', 'resolution', 'status', 'customfield_10102', 'customfield_10268'].join(','),
        },
        auth: {
          username: 'jack.allen@inshur.com',
          password: process.env.JIRA_API_TOKEN
        }
      });

      if (data.errorMessage) {
        return tickets;
      }

      total = data.total;

      if (!data.issues) {
        return tickets;
      }

      tickets.push(...data.issues);

    } catch (e) {
      return tickets;
    }
  }
  while (tickets.length < total)

  return tickets;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.token as string
  if (token?.toLowerCase() !== process.env.TOKEN?.toLowerCase()) {
    res.status(401).json({ error: 'Unauthorized', tickets: [] })
    return;
  }

  const { release } = req.query;
  const tickets = await getTickets(release as string);

  res.status(200).json({
    tickets: tickets.map(ticket => ({
      id: ticket.id,
      key: ticket.key,
      summary: ticket.fields.summary,
      created: ticket.fields.created,
      resolution: ticket.fields.resolution?.name,
      type: ticket.fields.issuetype?.name.toUpperCase(),
      status: ticket.fields.status?.name,
      services: ticket.fields.customfield_10268?.map(service => service.value),
      storyPoints: ticket.fields.customfield_10102
    }))
  })

}
