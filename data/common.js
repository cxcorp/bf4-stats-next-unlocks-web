export const namespaceToPlatform = (namespace) => {
  switch (namespace) {
    case "cem_ea_id":
    case "battlefield":
      return "pc";
    case "xbox":
      return "xbox360";
    case "ps3":
      return "ps3";
    default:
      return null;
  }
};
