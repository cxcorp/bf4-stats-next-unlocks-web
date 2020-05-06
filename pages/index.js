import { useCallback, useState } from "react";
import Head from "next/head";
import Router from "next/router";
import { Container, Row, Col } from "react-bootstrap";

import * as BattlelogCommon from "~/data/common";
import UserSearchForm from "~/components/UserSearchForm";
import { GithubIcon } from "~/components/GithubIcon";

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
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1>BF4 Next Attachment Unlocks</h1>
              <a
                style={{ marginLeft: "auto" }}
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
            <UserSearchForm
              className="mt-5"
              isPageLoading={loading}
              onSelect={handleUserSearchFormSelected}
            />
            <hr />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
