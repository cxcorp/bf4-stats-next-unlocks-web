import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import formatDistance from "date-fns/formatDistance";

import { getNextUnlocks } from "../../data";
import IdForm from "../../components/IdForm";
import LoadingButton from "../../components/LoadingButton";

const Layout = ({ id, loading = false, onIdFormSubmit, children }) => {
  return (
    <>
      <Head>User {id} | BF4 Next Attachment Unlocks</Head>

      <Container>
        <Row className="pt-3 pt-sm-5 justify-content-md-center">
          <Col lg={8}>
            <h1>BF4 Next Attachment Unlocks</h1>
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
          <Col lg={8}>{children}</Col>
        </Row>
      </Container>
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
      <Table striped bordered>
        <thead>
          <tr>
            <th>Kills needed</th>
            <th>Weapon</th>
            <th>Weapon type</th>
          </tr>
        </thead>
        <tbody>
          {nextUnlocks.map(
            ({ weapon, unlockId, unlockProgress: progress, killsNeeded }) => (
              <tr key={unlockId + weapon.guid}>
                <td>
                  <b>{killsNeeded}</b> ({progress.actualValue}/
                  {progress.valueNeeded})
                </td>
                <td>{weapon.slug.toUpperCase()}</td>
                <td>{weapon.category}</td>
              </tr>
            )
          )}
        </tbody>
      </Table>
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
