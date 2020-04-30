export const weaponCode = (acc) => acc.weaponAddonUnlock.weaponCode;
export const unlockId = (acc) => acc.weaponAddonUnlock.unlockId;
export const unlockProgress = (acc) => {
  const { actualValue, valueNeeded } = acc.weaponAddonUnlock.unlockedBy;
  return { actualValue, valueNeeded };
};
