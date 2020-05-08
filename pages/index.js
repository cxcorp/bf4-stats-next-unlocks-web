import { useCallback, useState } from "react";
import Head from "next/head";
import Router from "next/router";
import { Container, Row, Col } from "react-bootstrap";
import css from "styled-jsx/css";

import * as BattlelogCommon from "~/data/common";
import UserSearchForm from "~/components/UserSearchForm";
import { GithubIcon } from "~/components/GithubIcon";
import DarkModeSwitch from "~/components/DarkModeSwitch";

const layoutControlsStyle = css.resolve`
  .controls-container {
    text-align: right;
  }
`;

const Index = () => {
  const [loading, setLoading] = useState(false);

  const handleUserSearchFormSelected = useCallback((user) => {
    setLoading(true);

    const platformInt = BattlelogCommon.getPlatformIntFromSearchResult(user);
    const uriParts = [user.personaName, user.personaId, platformInt].map((s) =>
      encodeURI(s)
    );
    Router.push(
      "/unlocks/[personaName]/[personaId]/[platformInt]",
      `/unlocks/${uriParts.join("/")}`
    );
  }, []);

  return (
    <>
      <Head>
        <title>BF4 Next Attachment Unlocks</title>
      </Head>
      <Container>
        <Row className="pt-3 pt-sm-5">
          <Col lg={9}>
            <Row>
              <Col md="auto">
                <h1>BF4 Next Attachment Unlocks</h1>
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
              isPageLoading={loading}
              onSelect={handleUserSearchFormSelected}
            />
            <hr />
          </Col>
        </Row>
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

// force request to actually go to the server so that dark mode is applied
Index.getInitialProps = async () => ({});

export default Index;
