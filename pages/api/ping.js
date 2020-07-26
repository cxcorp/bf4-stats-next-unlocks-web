import { Client } from "pg";

/**
 * @param {import('@vercel/node').NowRequest} req
 * @param {import('@vercel/node').NowResponse} res
 */
export default async (req, res) => {
  if (!process.env.PING_DB_CONN_STR) {
    return res.status(200).end();
  }

  try {
    const client = new Client({
      connectionString: process.env.PING_DB_CONN_STR,
    });
    await client.connect();

    const debug = JSON.stringify(req.headers);
    await client.query({
      text: "INSERT INTO ping (timestamp, payload) VALUES ($1, $2)",
      values: [new Date(), debug],
      rowMode: "array",
    });
    await client.end();

    res.status(200).end();
  } catch (e) {
    res.status(500).end();
    console.error(e);
  }
};
