import { useState, useEffect, useCallback } from "react";
import PT from "prop-types";
import axios from "axios";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { Container, Badge, Row, Col, Button } from "react-bootstrap";
import formatDistance from "date-fns/formatDistance";
import css from "styled-jsx/css";

import { getNextUnlocks } from "~/domain";
import * as BattlelogCommon from "~/domain/common";
import LoadingButton from "~/components/LoadingButton";
import UserSearchForm from "~/components/UserSearchForm";
import UnlocksTable from "~/components/UnlocksTable";
import { GithubIcon } from "~/components/GithubIcon";
import DarkModeSwitch from "~/components/DarkModeSwitch";

const CurrentPersona = ({ className, platformInt, name }) => (
  <h2 className={className}>
    <Badge variant="secondary" className="mr-2">
      {BattlelogCommon.platformIntToHumanReadable(platformInt)}
    </Badge>
    {name}
  </h2>
);

const layoutControlsStyle = css.resolve`
  .controls-container {
    text-align: right;
  }
`;

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
            <Row>
              <Col md="auto">
                <Link href="/">
                  <a>
                    <h1>BF4 Next Attachment Unlocks</h1>
                  </a>
                </Link>
              </Col>
              <Col
                md="auto"
                className={`ml-auto controls-container ${layoutControlsStyle.className}`}
              >
                <div className="github-icon-container">
                  <a
                    rel="noopener"
                    href="https://github.com/cxcorp/bf4-stats-next-unlocks-web"
                  >
                    <GithubIcon />
                    <img
                      className="ml-2"
                      src="https://img.shields.io/github/issues/cxcorp/bf4-stats-next-unlocks-web?style=social"
                    />
                  </a>
                </div>
                <DarkModeSwitch className="ml-auto mt-2" />
              </Col>
            </Row>
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

      <style jsx>{`
        .github-icon-container {
          display: flex;
          align-items: center;
        }
      `}</style>
      {layoutControlsStyle.styles}
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

const DataDate = ({ dateString }) => {
  const [referenceDate, setReferenceDate] = useState(null);

  useEffect(() => {
    setReferenceDate(new Date());
  }, [dateString]);

  useEffect(() => {
    const token = setInterval(() => setReferenceDate(new Date()), 20000);
    return () => clearInterval(token);
  }, []);

  let date = new Date(dateString);
  if (referenceDate && date.getTime() > referenceDate.getTime()) {
    date = referenceDate;
  }

  return (
    referenceDate && (
      <time dateTime={date.toISOString()} title={date.toISOString()}>
        {formatDistance(date, referenceDate, {
          includeSeconds: true,
          addSuffix: true,
        })}
      </time>
    )
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
            Updated <DataDate dateString={dataDate} />
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
