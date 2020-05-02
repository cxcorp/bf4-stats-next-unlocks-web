import * as WeaponAccessory from "./selectedWeaponAccessory";
import * as WeaponCategory from "./weaponCategories";

export const getNextUnlocks = (weaponStats) => {
  const weaponsByGuid = Object.entries(weaponStats.data.weaponsByCategory)
    .filter(([id]) => WeaponCategory.isWeapon(id))
    .map(([id, categories]) =>
      categories.map((cat) => ({
        slug: WeaponCategory.slug(cat),
        guid: WeaponCategory.guid(cat),
        category: WeaponCategory.categoryName(id),
      }))
    )
    .flat()
    .reduce((acc, val) => {
      acc[val.guid] = val;
      return acc;
    }, {});

  const unlockProgresses = Object.entries(
    weaponStats.data.selectedWeaponAccessory
  )
    .filter(
      ([_, accessories]) =>
        accessories.weaponAddonUnlock.unlockedBy.valueNeeded !== null // already unlocked?
    )
    .map(([guid, accessory]) => {
      const unlockProgress = WeaponAccessory.unlockProgress(accessory);
      return {
        weapon: weaponsByGuid[guid],
        unlockId: WeaponAccessory.unlockId(accessory),
        attachmentName: WeaponAccessory.attachmentName(accessory),
        unlockProgress: unlockProgress,
        killsNeeded: unlockProgress.valueNeeded - unlockProgress.actualValue,
      };
    })
    .filter((obj) => !!obj.weapon)
    .sort((a, b) => a.killsNeeded - b.killsNeeded);

  return unlockProgresses;
};
