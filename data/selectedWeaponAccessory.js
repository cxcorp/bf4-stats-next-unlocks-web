export const weaponCode = (acc) => acc.weaponAddonUnlock.weaponCode;
export const unlockId = (acc) => acc.weaponAddonUnlock.unlockId;
export const unlockProgress = (acc) => {
  const { actualValue, valueNeeded } = acc.weaponAddonUnlock.unlockedBy;
  return { actualValue, valueNeeded };
};
export const attachmentName = (acc) => {
  const parts = (acc.weaponAddonUnlock.image || "").split("_");
  return parts.slice(0, parts.length - 1).join(" ");
};
export const image = (acc) => acc.weaponAddonUnlock.image;
export const serviceStar = (acc) => {
  const name = acc.weaponAddonUnlock.unlockId;
  const rgx = /weapon_.+_(\d)/;
  if (rgx.test(name)) {
    return rgx.exec(name)[1];
  } else {
    return null;
  }
};
