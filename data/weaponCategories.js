const categories = {
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

export const weaponCategories = {
  waPDW: "PDW",
  wD: "DMR",
  wC: "Carbine",
  wA: "Assault Rifle",
  wL: "LMG",
  wH: "Handgun",
  wSR: "Sniper Rifle",
  waS: "Shotgun",
};

export const categoryName = (id) => categories[id];
export const slug = (category) => category.weaponUnlock.slug;
export const guid = (category) => category.weaponUnlock.guid;
export const isWeapon = (id) => id in weaponCategories;
