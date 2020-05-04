import { useCallback, useState } from "react";
import Head from "next/head";
import Router from "next/router";
import { Container, Row, Col } from "react-bootstrap";

import * as BattlelogCommon from "../data/common";
import UserSearchForm from "../components/UserSearchForm";

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
            <h1>BF4 Next Attachment Unlocks</h1>
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
