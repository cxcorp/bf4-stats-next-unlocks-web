const weaponCategories = {
  wG: "Grenade",
  waPDW: "PDW",
  wD: "DMR",
  wC: "Carbine",
  wA: "Assault Rifle",
  wL: "LMG",
  wH: "Handgun",
  wSR: "Sniper Rifle",
  wSPk: "Knife",
  waS: "Shotgun",
  wX: "Gadget",
};

export const categoryName = (id) => weaponCategories[id];
export const slug = (category) => category.weaponUnlock.slug;
export const guid = (category) => category.weaponUnlock.guid;
export const isWeapon = (id) => id !== "wG" && id !== "wSPk" && id !== "wX";
