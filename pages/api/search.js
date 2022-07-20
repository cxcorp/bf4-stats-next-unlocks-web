import { URLSearchParams } from "url";
import axios from "axios";

import { BF4_GAME_ID_BITMASK } from "~/domain/common";

const isBf4Persona = (persona) =>
  Object.values(persona.games).some(
    (games) => (Number(games) & BF4_GAME_ID_BITMASK) === BF4_GAME_ID_BITMASK
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
    new URLSearchParams({
      query: term,
    }).toString(),
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
