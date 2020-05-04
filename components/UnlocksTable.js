import { useState, useCallback } from "react";
import { Col, Table, Button, Form } from "react-bootstrap";

import { useOnCtrlClick, usePersistedState } from "../util/hooks";
import { maxBy, toLookup, setValuesTo } from "../util";
import { weaponCategories } from "../data/weaponCategories";
import { WordBreaked } from "../util/components";
import WeaponAccessory from "./WeaponAccessory";

const UnlocksTable = ({ unlocks, children: sidebar }) => {
  const [minCurrentKills, setMinKills] = usePersistedState(
    0,
    "UNLOCKS-FILTER-MIN-CURR-KILLS"
  );
  const [selectedCategories, setSelectedCategories] = usePersistedState(
    toLookup(Object.values(weaponCategories), (_) => _),
    "UNLOCKS-FILTER-WEAPON-CATEGORY"
  );
  const [doneGuids, setDoneGuids] = useState({});

  const handleMinKillsChange = useCallback((e) => {
    e.preventDefault();
    setMinKills(e.target.value);
  }, []);

  const handleDoneClicked = useCallback((e) => {
    const guid = e.target.dataset.guid;
    setDoneGuids((guids) => ({ ...guids, [guid]: !guids[guid] }));
  });

  const handleDebugclick = useOnCtrlClick((e) => {
    console.log(e.currentTarget.dataset);
  }, []);

  const handleWeaponCategoryFilterChecked = useCallback((e) => {
    const checkedName = e.currentTarget.name;
    setSelectedCategories((categories) => ({
      ...categories,
      [checkedName]: !categories[checkedName],
    }));
  }, []);

  const handleCheckAllWeaponCategories = useCallback((e) => {
    e.preventDefault();
    setSelectedCategories((categories) => setValuesTo(categories, true));
  }, []);

  const handleUncheckAllWeaponCategories = useCallback((e) => {
    e.preventDefault();
    setSelectedCategories((categories) => setValuesTo(categories, false));
  }, []);

  const largestCurrentKills = maxBy(
    unlocks,
    (unlock) => unlock.unlockProgress.actualValue
  );

  return (
    <>
      <Col lg={3} className="order-lg-2">
        {sidebar}
        <hr />

        <Form.Group controlId="123">
          <Form.Label>
            Only show unlocks with current kills > <b>{minCurrentKills}</b>
          </Form.Label>
          <Form.Control
            type="range"
            value={minCurrentKills}
            min={0}
            max={
              largestCurrentKills
                ? largestCurrentKills.unlockProgress.actualValue
                : 500
            }
            onChange={handleMinKillsChange}
          />
        </Form.Group>

        <hr />

        <Form.Group controlId="321">
          <Form.Label>Filter groups</Form.Label>

          {Object.values(weaponCategories)
            .sort()
            .map((category) => (
              <Form.Check
                key={category}
                onChange={handleWeaponCategoryFilterChecked}
                checked={!!selectedCategories[category]}
                type="checkbox"
                id={`weapon-cat-${category}`}
                name={category}
                label={category}
              />
            ))}
        </Form.Group>
        <Form.Group>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={handleCheckAllWeaponCategories}
          >
            Show all
          </Button>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={handleUncheckAllWeaponCategories}
          >
            Hide all
          </Button>
        </Form.Group>
      </Col>
      <Col lg={9} className="order-lg-1">
        <Table striped bordered>
          <thead>
            <tr>
              <th>Kills needed</th>
              <th>Unlock</th>
              <th>Weapon</th>
              <th>Weapon type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {unlocks
              .filter(
                (u) =>
                  u.unlockProgress.actualValue >= minCurrentKills &&
                  selectedCategories[u.weapon.category]
              )
              .map(
                ({
                  weapon,
                  attachmentName,
                  image,
                  unlockId,
                  unlockProgress: progress,
                  killsNeeded,
                  serviceStar,
                }) => {
                  const markedDone = doneGuids[weapon.guid];
                  return (
                    <tr
                      onClick={handleDebugclick}
                      className={markedDone ? "unlock-row--done" : ""}
                      data-weapon-guid={weapon.guid}
                      data-unlock-id={unlockId}
                      data-weapon-slug={weapon.slug}
                      key={unlockId + weapon.guid}
                    >
                      <td>
                        <b>{killsNeeded}</b> ({progress.actualValue}/
                        {progress.valueNeeded})
                      </td>
                      <td>
                        {serviceStar && `Service star ${serviceStar}`}
                        {image && <WeaponAccessory imageSlug={image} />}
                        <WordBreaked text={attachmentName} />
                      </td>
                      <td>{weapon.slug.toUpperCase()}</td>
                      <td>{weapon.category}</td>
                      <td>
                        <Button
                          data-guid={weapon.guid}
                          size="sm"
                          variant="outline-secondary"
                          onClick={handleDoneClicked}
                        >
                          {markedDone ? "undo" : "done"}
                        </Button>
                      </td>
                    </tr>
                  );
                }
              )}
          </tbody>
        </Table>
      </Col>
      <style jsx>{`
        .unlock-row--done > td {
          opacity: 0.3;
        }
      `}</style>
    </>
  );
};

export default UnlocksTable;
