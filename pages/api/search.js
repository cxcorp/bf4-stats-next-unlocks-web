import axios from "axios";
import querystring from "querystring";

const bf4GameBit = 2048;
const isBf4Persona = (persona) =>
  Object.values(persona.games).some(
    (games) => (Number(games) & bf4GameBit) === bf4GameBit
  );

export default async (req, res) => {
  const { term } = req.body;
  if (typeof term !== "string") {
    return res.status(400).json({ error: "term is required" });
  }

  if (term.length < 3) {
    return res.status(200).json([]);
  }

  const { data } = await axios.post(
    "https://battlelog.battlefield.com/bf4/search/query/",
    querystring.stringify({
      query: term,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (data.type !== "success") {
    return res.status(500).json(data);
  }

  res.status(200).json(data.data.filter(isBf4Persona));
};
