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
