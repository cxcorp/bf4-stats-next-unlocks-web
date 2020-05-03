import { useState, useEffect, useCallback, createRef } from "react";
import axios from "axios";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import formatDistance from "date-fns/formatDistance";

import { LOCALSTORAGE_PERSONA_ID_KEY } from "../../common";
import { getNextUnlocks } from "../../data";
import IdForm from "../../components/IdForm";
import LoadingButton from "../../components/LoadingButton";
import WeaponAccessory from "../../components/WeaponAccessory";

const Layout = ({ id, loading = false, onIdFormSubmit, children }) => {
  return (
    <>
      <Head>User {id} | BF4 Next Attachment Unlocks</Head>

      <Container>
        <Row className="pt-3 pt-sm-5 justify-content-md-center">
          <Col lg={9}>
            <Link href="/">
              <a>
                <h1>BF4 Next Attachment Unlocks</h1>
              </a>
            </Link>
            <IdForm
              className="mt-5"
              loading={loading}
              defaultId={id}
              onSubmit={onIdFormSubmit}
            />
            <hr />
          </Col>
        </Row>
        <Row className="pt-3 pt-sm-5 justify-content-md-center">
          <Col lg={9}>{children}</Col>
        </Row>
      </Container>
    </>
  );
};

const WordBreaked = ({ children: text }) => {
  if (!text || typeof text !== "string") {
    return text;
  }

  return text.split(/(?=[A-Z])/).map((word, i) => (
    <React.Fragment key={word + i}>
      <span>{word}</span>
      <wbr />
    </React.Fragment>
  ));
};

const maxBy = (arr, fn) => {
  return arr.reduce((a, b) => (fn(a) > fn(b) ? a : b), arr[0]);
};

const UnlocksTable = ({ unlocks }) => {
  const [minCurrentKills, setMinKills] = useState(0);
  const [doneGuids, setDoneGuids] = useState({});

  const handleMinKillsChange = useCallback((e) => {
    e.preventDefault();
    setMinKills(e.target.value);
  }, []);

  const handleDoneClicked = useCallback((e) => {
    const guid = e.target.dataset.guid;
    setDoneGuids((guids) => ({ ...guids, [guid]: !guids[guid] }));
  });

  const largestCurrentKills = maxBy(
    unlocks,
    (unlock) => unlock.unlockProgress.actualValue
  );

  return (
    <>
      <Form>
        <Form.Group controlId="formBasicRange">
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
      </Form>

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
            .filter((u) => u.unlockProgress.actualValue >= minCurrentKills)
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
                    className={markedDone ? "unlock-row--done" : ""}
                    key={unlockId + weapon.guid}
                  >
                    <td>
                      <b>{killsNeeded}</b> ({progress.actualValue}/
                      {progress.valueNeeded})
                    </td>
                    <td>
                      {serviceStar && `Service star ${serviceStar}`}
                      {image && <WeaponAccessory imageSlug={image} />}
                      <WordBreaked>{attachmentName}</WordBreaked>
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
  const { personaId } = router.query;

  const [loading, setLoading] = useState(false);

  const handleRefreshClicked = useCallback(
    (e) => {
      e.preventDefault();
      setLoading(true);
      window.location.reload();
    },
    [personaId]
  );

  const handleIdFormSubmit = useCallback(
    (newPersonaId) => {
      setLoading(true);

      // nextjs won't unmount this component if it's navigating to the same page
      // -> force reload
      if (newPersonaId === personaId) {
        window.location.reload();
      } else {
        Router.push("/unlocks/[personaId]", `/unlocks/${newPersonaId}`);
      }
    },
    [personaId]
  );

  useEffect(() => {
    if (error) {
      return;
    }
    try {
      localStorage.setItem(LOCALSTORAGE_PERSONA_ID_KEY, personaId);
    } catch (e) {
      console.error("Failed to persist persona ID to localStorage", e);
    }
  }, [personaId, error]);

  if (error) {
    return (
      <Layout id={personaId} onIdFormSubmit={handleIdFormSubmit}>
        Error: {error}
      </Layout>
    );
  }

  return (
    <Layout
      id={personaId}
      loading={loading}
      onIdFormSubmit={handleIdFormSubmit}
    >
      <Row>
        <Col>
          <p style={{ display: "flex", alignItems: "baseline" }}>
            <span>
              Updated <DataDate date={new Date(dataDate)} />
            </span>
            {loading ? (
              <LoadingButton
                style={{ marginLeft: "auto" }}
                variant="outline-primary"
              />
            ) : (
              <Button
                style={{ marginLeft: "auto" }}
                variant="outline-primary"
                onClick={handleRefreshClicked}
              >
                Refresh
              </Button>
            )}
          </p>
        </Col>
      </Row>
      <UnlocksTable unlocks={nextUnlocks} />
    </Layout>
  );
};

export async function getServerSideProps({ params: { personaId } }) {
  const PERSONA_ID_REGEX = /^[0-9]{1,12}$/g;
  if (!PERSONA_ID_REGEX.test(personaId)) {
    return {
      props: {
        nextUnlocks: null,
        error: "invalid BF4 persona ID",
      },
    };
  }

  const { data } = await axios.get(
    `https://battlelog.battlefield.com/bf4/warsawWeaponsPopulateStats/${personaId}/1/unlocks/`
  );
  return {
    props: {
      nextUnlocks: getNextUnlocks(data),
      dataDate: new Date().toISOString(),
    },
  };
}

export default Unlocks;
