import { useAppContext } from "~/components/AppContext";

const WeaponAccessory = ({ imageSlug }) => {
  const { isDarkMode } = useAppContext();

  return (
    <>
      <div className={["weapon-accessory", imageSlug].join(" ")}></div>
      <style jsx>{`
        .weapon-accessory {
          display: inline-block;
          filter: invert(${isDarkMode ? "0" : "1"});
          background-image: url(https://cdn.battlelog.com/bl-cdn/cdnprefix/1715536/public/profile/warsaw/gamedata/weaponaccessory/small.png);
          width: 64px;
          height: 16px;
          background-size: 576px 144px;
        }

        @media only screen and (-webkit-min-device-pixel-ratio: 2),
          only screen and (min-device-pixel-ratio: 2) {
          .weapon-accessory {
            background-image: url(https://cdn.battlelog.com/bl-cdn/cdnprefix/1715536/public/profile/warsaw/gamedata/weaponaccessory/small@2x.png);
          }
        }
        .weapon-accessory.ACOG_lineart {
          background-position: 0 0;
        }
        .weapon-accessory.ACRGeneralIronSight_Rear_lineart {
          background-position: -64px 0;
        }
        .weapon-accessory.ATNThor_lineart {
          background-position: -128px 0;
        }
        .weapon-accessory.AngledGrip_lineart {
          background-position: -192px 0;
        }
        .weapon-accessory.Ballistic_lineart {
          background-position: -256px 0;
        }
        .weapon-accessory.Barrel_lineart {
          background-position: -320px 0;
        }
        .weapon-accessory.Bipod_lineart {
          background-position: -384px 0;
        }
        .weapon-accessory.Buck_lineart {
          background-position: -448px 0;
        }
        .weapon-accessory.CL6x_Chinese6x_lineart {
          background-position: -512px 0;
        }
        .weapon-accessory.CP1prismatic_lineart {
          background-position: 0 -16px;
        }
        .weapon-accessory.CantedIronsightSniper_Rear_lineart {
          background-position: -64px -16px;
        }
        .weapon-accessory.CantedIronsight_Rear_lineart {
          background-position: -128px -16px;
        }
        .weapon-accessory.Compact4X_lineart {
          background-position: -192px -16px;
        }
        .weapon-accessory.Compensator_lineart {
          background-position: -256px -16px;
        }
        .weapon-accessory.Coyote_lineart {
          background-position: -320px -16px;
        }
        .weapon-accessory.Deltapoint_lineart {
          background-position: -384px -16px;
        }
        .weapon-accessory.Duckbill_lineart {
          background-position: -448px -16px;
        }
        .weapon-accessory.F2000scope_lineart {
          background-position: -512px -16px;
        }
        .weapon-accessory.Flashlight_lineart {
          background-position: 0 -32px;
        }
        .weapon-accessory.Flashsupressor_lineart {
          background-position: -64px -32px;
        }
        .weapon-accessory.Flechette_lineart {
          background-position: -128px -32px;
        }
        .weapon-accessory.Foregrip_Ergo_lineart {
          background-position: -192px -32px;
        }
        .weapon-accessory.Foregrip_Folding_lineart {
          background-position: -256px -32px;
        }
        .weapon-accessory.Foregrip_Potato_lineart {
          background-position: -320px -32px;
        }
        .weapon-accessory.Foregrip_Stubby_lineart {
          background-position: -384px -32px;
        }
        .weapon-accessory.Foregrip_Vertical_lineart {
          background-position: -448px -32px;
        }
        .weapon-accessory.Frag_lineart {
          background-position: -512px -32px;
        }
        .weapon-accessory.GhostRing_lineart {
          background-position: 0 -48px;
        }
        .weapon-accessory.GreenLaser_lineart {
          background-position: -64px -48px;
        }
        .weapon-accessory.Laser_PistolCombo_lineart {
          background-position: -128px -48px;
        }
        .weapon-accessory.Laser_PistolLaser_lineart {
          background-position: -192px -48px;
        }
        .weapon-accessory.Laser_RifleComboPEQ15_lineart {
          background-position: -256px -48px;
        }
        .weapon-accessory.Laser_STORM_lineart {
          background-position: -320px -48px;
        }
        .weapon-accessory.Laser_TargetPointer_lineart {
          background-position: -384px -48px;
        }
        .weapon-accessory.Laser_Tribeam_lineart {
          background-position: -448px -48px;
        }
        .weapon-accessory.Magnifier_lineart {
          background-position: -512px -48px;
        }
        .weapon-accessory.MuzzleBreakLight_lineart {
          background-position: 0 -64px;
        }
        .weapon-accessory.MuzzleBreak_lineart {
          background-position: -64px -64px;
        }
        .weapon-accessory.NarrowChoke_lineart {
          background-position: -128px -64px;
        }
        .weapon-accessory.PBS-4_lineart {
          background-position: -192px -64px;
        }
        .weapon-accessory.PK-AS_PKA-S_lineart {
          background-position: -256px -64px;
        }
        .weapon-accessory.PSO-1_lineart {
          background-position: -320px -64px;
        }
        .weapon-accessory.PistolCompensator_lineart {
          background-position: -384px -64px;
        }
        .weapon-accessory.PistolMuzzlebreak_lineart {
          background-position: -448px -64px;
        }
        .weapon-accessory.QSW-06_MP7Supressor_lineart {
          background-position: -512px -64px;
        }
        .weapon-accessory.RMR_lineart {
          background-position: 0 -80px;
        }
        .weapon-accessory.RX01_lineart {
          background-position: -64px -80px;
        }
        .weapon-accessory.Rails_lineart {
          background-position: -128px -80px;
        }
        .weapon-accessory.Slug_lineart {
          background-position: -192px -80px;
        }
        .weapon-accessory.Spyder_N_lineart {
          background-position: -256px -80px;
        }
        .weapon-accessory.Spyder_Poison_lineart {
          background-position: -320px -80px;
        }
        .weapon-accessory.Spyder_S_lineart {
          background-position: -384px -80px;
        }
        .weapon-accessory.Spyder_X_lineart {
          background-position: -448px -80px;
        }
        .weapon-accessory.Spyder_counterweight_lineart {
          background-position: -512px -80px;
        }
        .weapon-accessory.StraightBolt_lineart {
          background-position: 0 -96px;
        }
        .weapon-accessory.Supressor_FH762MG_lineart {
          background-position: -64px -96px;
        }
        .weapon-accessory.Supressor_MiniMonster_lineart {
          background-position: -128px -96px;
        }
        .weapon-accessory.Supressor_PBS1_lineart {
          background-position: -192px -96px;
        }
        .weapon-accessory.Supressor_TGPA_lineart {
          background-position: -256px -96px;
        }
        .weapon-accessory.TDD_lineart {
          background-position: -320px -96px;
        }
        .weapon-accessory.Tacticallight_lineart {
          background-position: -384px -96px;
        }
        .weapon-accessory.Trubrite_lineart {
          background-position: -448px -96px;
        }
        .weapon-accessory.VariableZoom_lineart {
          background-position: -512px -96px;
        }
        .weapon-accessory.VisionKing_lineart {
          background-position: 0 -112px;
        }
        .weapon-accessory.WideChoke_lineart {
          background-position: -64px -112px;
        }
        .weapon-accessory._NoSelection_lineart {
          background-position: -128px -112px;
        }
        .weapon-accessory.eotech_lineart {
          background-position: -192px -112px;
        }
        .weapon-accessory.irnv_lineart {
          background-position: -256px -112px;
        }
        .weapon-accessory.kobra_lineart {
          background-position: -320px -112px;
        }
        .weapon-accessory.m145_lineart {
          background-position: -384px -112px;
        }
        .weapon-accessory.pka_lineart {
          background-position: -448px -112px;
        }
        .weapon-accessory.pks07_lineart {
          background-position: -512px -112px;
        }
        .weapon-accessory.riflescope_lineart {
          background-position: 0 -128px;
        }
        .weapon-accessory.soundsupressor_lineart {
          background-position: -64px -128px;
        }
      `}</style>
    </>
  );
};

export default WeaponAccessory;
