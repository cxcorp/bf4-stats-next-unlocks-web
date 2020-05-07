import { useState, useCallback, useMemo } from "react";
import { Col, Table, Button, Form } from "react-bootstrap";
import css from "styled-jsx/css";

import { usePersistedState } from "~/util/hooks";
import { maxBy, toLookup, setValuesTo } from "~/util";
import { weaponCategories } from "~/data/weaponCategories";
import { maxKills } from "~/data/weaponMaxKills";
import { WordBreaked } from "~/util/components";
import { Heart, HeartOutline } from "~/components/HeartIcon";
import { ChevronUp, ChevronDown } from "~/components/ChevronIcon";
import WeaponAccessory from "./WeaponAccessory";

const FAVORITES_STORAGE_KEY = "UNLOCKS-TABLE-FAVORITES";

const CompletionBar = React.memo(({ progress, total }) => {
  const percentage = ((progress / total) * 100).toFixed(0);

  const hue = Math.floor(130 - (progress / total) * 130);
  const color = `hsl(${hue}, 90%, 51%)`;

  return (
    <>
      <div className="wrapper">
        <span className="percentage pb-1">{percentage}%</span>
        <div className="bar-container">
          <div
            className="bar"
            style={{ width: `${(progress / total) * 100}%`, background: color }}
          ></div>
        </div>
        <span className="numbers">
          {progress}/{total}
        </span>
      </div>
      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .bar-container {
          position: relative;
          height: 5px;
          background: #f1e4d0;
          width: 100%;
        }

        .bar {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
        }

        .percentage {
          font-weight: bold;
          font-size: 0.8rem;
        }

        .numbers {
          font-size: 0.8rem;
        }
      `}</style>
    </>
  );
});

const UnlocksTableRow = React.memo(
  ({
    unlock: {
      weapon,
      attachmentName,
      image,
      unlockId,
      unlockProgress: progress,
      killsNeeded,
      battlePack,
    },
    isFavorited,
    isMarkedDone,
    onFavoriteToggled,
    onDoneToggled,
  }) => {
    const handleFavoriteClicked = useCallback(() => {
      onFavoriteToggled(weapon.guid);
    }, [onFavoriteToggled, weapon.guid]);
    const handleDoneClicked = useCallback(() => {
      onDoneToggled(weapon.guid);
    }, [onDoneToggled, weapon.guid]);

    const FavoriteButton = isFavorited ? Heart : HeartOutline;
    return (
      <>
        <tr className={isMarkedDone ? "done" : ""}>
          <td>
            <b>{killsNeeded}</b> ({progress.actualValue}/{progress.valueNeeded})
          </td>
          <td>
            {battlePack && `Battlepack ${battlePack}`}
            {image && <WeaponAccessory imageSlug={image} />}
            <WordBreaked text={attachmentName} />
          </td>
          <td>
            <span className="weapon-name">{weapon.slug.toUpperCase()}</span>
            <span className="favorite-button">
              <FavoriteButton onClick={handleFavoriteClicked} />
            </span>
          </td>
          <td>{weapon.category}</td>
          <td className="p-0 py-1">
            <CompletionBar
              progress={progress.actualValue}
              total={maxKills[weapon.guid]}
            />
          </td>
          <td className="px-0">
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={handleDoneClicked}
            >
              {isMarkedDone ? "undo" : "done"}
            </Button>
          </td>
        </tr>
        <style jsx>{`
          .done > td {
            opacity: 0.3;
          }

          .weapon-name {
            float: left;
          }

          .favorite-button {
            float: right;
            cursor: pointer;
            color: #999;
          }
        `}</style>
      </>
    );
  }
);

const Sorters = {
  KillsNeeded: "KillsNeeded",
  Category: "Category",
  Completion: "Completion",
};
const SorterFn = {
  [Sorters.KillsNeeded]: (a, b) => a.killsNeeded - b.killsNeeded,
  [Sorters.Completion]: (a, b) =>
    a.unlockProgress.actualValue / maxKills[a.weapon.guid] -
    b.unlockProgress.actualValue / maxKills[b.weapon.guid],
  [Sorters.Category]: (a, b) =>
    a.weapon.category.localeCompare(b.weapon.category),
};

const SortDir = {
  ASC: 1,
  DESC: -1,
};

const SortableTh = ({
  activeId,
  direction,
  sorterId,
  onSort,
  children,
  ...props
}) => {
  const handleClick = useCallback(
    (e) => {
      onSort(sorterId);
    },
    [onSort, sorterId]
  );

  const active = activeId === sorterId;
  return (
    <>
      <th
        className={`sortable ${!active ? "sortable--inactive" : ""}`}
        onClick={handleClick}
        {...props}
      >
        <div className="wrapper">
          <div className="label">{children}</div>
          <div className="icon">
            {active ? (
              direction === SortDir.ASC ? (
                <ChevronUp />
              ) : (
                <ChevronDown />
              )
            ) : (
              <ChevronDown />
            )}
          </div>
        </div>
      </th>
      <style jsx>{`
        th {
          cursor: pointer;
          user-select: none;
        }

        .wrapper {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }

        .icon {
          margin-left: auto;
        }

        .sortable--inactive .icon {
          opacity: 0.3;

          transition: opacity 150ms cubic-bezier(0, 0, 0.2, 1);
        }

        .sortable--inactive:hover .icon {
          opacity: 0.75;
        }
      `}</style>
    </>
  );
};

const unlocksTableStyle = css.resolve`
  table {
    font-size: 0.9rem;
  }

  .favorites {
    border-bottom: 5px solid #fff;
  }
`;

const UnlocksTable = ({
  unlocks,
  favoriteUnlocks,
  isWeaponFavorite,
  isWeaponDone,
  getSortableProps,
  onFavoriteToggled,
  onDoneToggled,
}) => {
  const makeRow = useCallback(
    (unlock) => (
      <UnlocksTableRow
        key={`${unlock.unlockId}_${unlock.weapon.guid}`}
        unlock={unlock}
        isFavorited={isWeaponFavorite(unlock.weapon.guid)}
        onFavoriteToggled={onFavoriteToggled}
        isMarkedDone={isWeaponDone(unlock.weapon.guid)}
        onDoneToggled={onDoneToggled}
      />
    ),
    [isWeaponFavorite, onFavoriteToggled, isWeaponDone, onDoneToggled]
  );

  return (
    <>
      <Table
        className={unlocksTableStyle.className}
        striped
        bordered
        responsive
      >
        <thead>
          <tr>
            <SortableTh {...getSortableProps(Sorters.KillsNeeded)}>
              Kills needed
            </SortableTh>
            <th>Unlock</th>
            <th>Weapon</th>
            <SortableTh {...getSortableProps(Sorters.Category)}>
              Category
            </SortableTh>
            <SortableTh {...getSortableProps(Sorters.Completion)}>
              Completion
            </SortableTh>
            <th></th>
          </tr>
        </thead>
        <tbody className="favorites">{favoriteUnlocks.map(makeRow)}</tbody>
        <tbody>{unlocks.map(makeRow)}</tbody>
      </Table>
      {unlocksTableStyle.styles}
    </>
  );
};

const UnlocksTableContainer = ({ unlocks, children: sidebar }) => {
  const [sorter, setSorter] = usePersistedState(
    { id: Sorters.KillsNeeded, dir: SortDir.ASC },
    "UNLOCKS-SORTER"
  );
  const unlocksSorter = useMemo(
    () => (a, b) => SorterFn[sorter.id](a, b) * sorter.dir,
    [sorter.id, sorter.dir]
  );

  const [favorites, setFavorites] = usePersistedState(
    {},
    FAVORITES_STORAGE_KEY
  );
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

  const handleDoneToggled = useCallback((weaponGuid) => {
    setDoneGuids((guids) => ({ ...guids, [weaponGuid]: !guids[weaponGuid] }));
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

  const handleFavoriteToggled = useCallback((weaponGuid) => {
    setFavorites((favorites) => ({
      ...favorites,
      [weaponGuid]: !favorites[weaponGuid],
    }));
  }, []);

  const handleSort = useCallback((newSorter) => {
    setSorter((currentSorter) => ({
      id: newSorter,
      // if clicked on active sorter, just reverse the direction
      // other wise default to ASC
      dir:
        currentSorter.id === newSorter ? currentSorter.dir * -1 : SortDir.ASC,
    }));
  }, []);

  const getSortableProps = useCallback(
    (sorterId) => ({
      activeId: sorter.id,
      sorterId,
      direction: sorter.dir,
      onSort: handleSort,
    }),
    [sorter, handleSort]
  );

  const isWeaponFavorite = useCallback(
    (weaponGuid) => !!favorites[weaponGuid],
    [favorites]
  );

  const isWeaponDone = useCallback((weaponGuid) => !!doneGuids[weaponGuid], [
    doneGuids,
  ]);

  const largestCurrentKills = maxBy(
    unlocks,
    (unlock) => unlock.unlockProgress.actualValue
  );

  const favoriteUnlocks = useMemo(
    () => unlocks.filter((u) => !!favorites[u.weapon.guid]).sort(unlocksSorter),
    [favorites, unlocksSorter]
  );
  const filteredUnlocks = useMemo(
    () =>
      unlocks
        .filter(
          (u) =>
            // don't show favorites twice
            !favorites[u.weapon.guid] &&
            // current kills filter
            u.unlockProgress.actualValue >= minCurrentKills &&
            // weapon category filter
            selectedCategories[u.weapon.category]
        )
        .sort(unlocksSorter),
    [favorites, minCurrentKills, selectedCategories, unlocksSorter]
  );

  return (
    <>
      <Col lg={3} className="order-lg-2">
        {sidebar}
        <hr />

        <Form.Group controlId="123">
          <Form.Label>
            Only show unlocks with current kills ≥ <b>{minCurrentKills}</b>
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
        <UnlocksTable
          unlocks={filteredUnlocks}
          favoriteUnlocks={favoriteUnlocks}
          isWeaponFavorite={isWeaponFavorite}
          isWeaponDone={isWeaponDone}
          getSortableProps={getSortableProps}
          onFavoriteToggled={handleFavoriteToggled}
          onDoneToggled={handleDoneToggled}
        />
      </Col>
    </>
  );
};

export default UnlocksTableContainer;
