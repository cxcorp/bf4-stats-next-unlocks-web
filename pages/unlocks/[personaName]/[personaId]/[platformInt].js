import { useState, useEffect, useCallback } from "react";
import PT from "prop-types";
import axios from "axios";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import {
  Container,
  Badge,
  Row,
  Col,
  Button,
  Table,
  Form,
} from "react-bootstrap";
import formatDistance from "date-fns/formatDistance";

import { maxBy, toLookup, setValuesTo } from "../../../../util";
import { getNextUnlocks } from "../../../../data";
import { weaponCategories } from "../../../../data/weaponCategories";
import * as BattlelogCommon from "../../../../data/common";
import { useOnCtrlClick, usePersistedState } from "../../../../util/hooks";
import { WordBreaked } from "../../../../util/components";
import LoadingButton from "../../../../components/LoadingButton";
import UserSearchForm from "../../../../components/UserSearchForm";
import UnlocksTable from "../../../../components/UnlocksTable";
import WeaponAccessory from "../../../../components/WeaponAccessory";

const CurrentPersona = ({ className, platformInt, name }) => (
  <h2 className={className}>
    <Badge variant="secondary" className="mr-2">
      {BattlelogCommon.platformIntToHumanReadable(platformInt)}
    </Badge>
    {name}
  </h2>
);

const Layout = ({
  title,
  isPageLoading,
  persona,
  onUserSearchSelected,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Container>
        <Row className="pt-3 pt-sm-5">
          <Col lg={9}>
            <Link href="/">
              <a>
                <h1>BF4 Next Attachment Unlocks</h1>
              </a>
            </Link>
            <UserSearchForm
              className="mt-5"
              isPageLoading={isPageLoading}
              onSelect={onUserSearchSelected}
            />
            <hr />
            <CurrentPersona
              className="mt-2 mt-sm-4"
              platformInt={persona.platformInt}
              name={persona.name}
            />
          </Col>
        </Row>
        {children}
      </Container>
    </>
  );
};

Layout.propTypes = {
  title: PT.string.isRequired,
  isPageLoading: PT.bool,
  persona: PT.shape({
    name: PT.string.isRequired,
    id: PT.oneOfType([PT.string, PT.number]).isRequired,
    platformInt: PT.number.isRequired,
  }),
  onUserSearchSelected: PT.func.isRequired,
  children: PT.node,
};

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

const DataDate = ({ date }) => {
  const [referenceDate, setReferenceDate] = useState(new Date());

  useEffect(() => {
    const token = setInterval(() => setReferenceDate(new Date()), 30000);
    return () => clearInterval(token);
  }, []);

  return (
    <time dateTime={date.toISOString()} title={date.toISOString()}>
      {formatDistance(date, referenceDate, {
        includeSeconds: true,
        addSuffix: true,
      })}
    </time>
  );
};

const Unlocks = ({ nextUnlocks, dataDate, error }) => {
  const router = useRouter();
  const { personaId, personaName } = router.query;
  const platformInt = Number(router.query.platformInt);
  const currentPersona = { id: personaId, name: personaName, platformInt };

  const [loading, setLoading] = useState(false);

  // set loading = false when nextjs just updates the props instead of doing a page reload
  useEffect(() => {
    setLoading(false);
  }, [dataDate, personaId, platformInt, personaName]);

  const handleRefreshClicked = useCallback(
    (e) => {
      e.preventDefault();
      setLoading(true);
      window.location.reload();
    },
    [personaId]
  );

  const handleUserSearchFormSelected = useCallback(
    (user) => {
      setLoading(true);

      const newPlatformInt = BattlelogCommon.getPlatformIntFromSearchResult(
        user
      );

      // same persona, just reload the page or nextjs won't getServerSideProps()
      if (user.personaId === personaId && user.platformInt === platformInt) {
        window.location.reload();
        return;
      }

      const uriParts = [
        user.personaName,
        user.personaId,
        newPlatformInt,
      ].map((s) => encodeURI(s));
      Router.push(
        "/unlocks/[personaName]/[personaId]/[platformInt]",
        `/unlocks/${uriParts.join("/")}`
      );
    },
    [personaId, platformInt, personaName]
  );

  if (error) {
    return (
      <Layout
        title={`Player ${personaName} | BF4 Next Attachment Unlocks`}
        isPageLoading={loading}
        persona={currentPersona}
        onUserSearchSelected={handleUserSearchFormSelected}
      >
        Error: {error}
      </Layout>
    );
  }

  return (
    <Layout
      title={`Player ${personaName} | BF4 Next Attachment Unlocks`}
      isPageLoading={loading}
      persona={currentPersona}
      onUserSearchSelected={handleUserSearchFormSelected}
    >
      <Row className="pt-2 pt-sm-3 justify-content-md-center">
        <UnlocksTable unlocks={nextUnlocks}>
          <p>
            Updated <DataDate date={new Date(dataDate)} />
          </p>
          <p>
            {loading ? (
              <LoadingButton variant="outline-primary" />
            ) : (
              <Button variant="outline-primary" onClick={handleRefreshClicked}>
                Refresh
              </Button>
            )}
          </p>
        </UnlocksTable>
      </Row>
    </Layout>
  );
};

export async function getServerSideProps({
  params: { personaId, platformInt },
}) {
  const PERSONA_ID_REGEX = /^[0-9]{1,15}$/g;
  if (!PERSONA_ID_REGEX.test(personaId)) {
    return {
      props: {
        nextUnlocks: null,
        error: "invalid BF4 persona ID",
      },
    };
  }
  const pint = Number(platformInt);
  if (isNaN(pint)) {
    return {
      props: {
        nextUnlocks: null,
        error: "invalid platformInt",
      },
    };
  }

  const { data } = await axios.get(
    `https://battlelog.battlefield.com/bf4/warsawWeaponsPopulateStats/${personaId}/${pint}/unlocks/`
  );
  return {
    props: {
      nextUnlocks: getNextUnlocks(data),
      dataDate: new Date().toISOString(),
    },
  };
}

export default Unlocks;
