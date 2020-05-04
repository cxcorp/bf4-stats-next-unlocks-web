const platformIntToPlatform = (platformInt) => {
  switch (platformInt) {
    case 1:
      return "pc";
    case 2:
      return "xbox360";
    case 4:
      return "ps3";
    case 32:
      return "ps4";
    case 64:
      return "xboxone";
    default:
      return "pc";
  }
};

export const BF4_GAME_ID = 2048;

const findFirstPlatformWithBF4 = (games) =>
  games
    .map((entry) => entry.map((val) => Number(val)))
    .filter(([, games]) => (games & BF4_GAME_ID) === BF4_GAME_ID)[0];

export const getPlatformIntFromSearchResult = (res) => {
  const [platformInt] = findFirstPlatformWithBF4(Object.entries(res.games));
  return platformInt;
};

export const platformIntToHumanReadable = (pint) => {
  switch (pint) {
    case 1:
      return "PC";
    case 2:
      return "Xbox 360";
    case 4:
      return "PS3";
    case 32:
      return "PS4";
    case 64:
      return "Xbox One";
    default:
      return "PC";
  }
};
