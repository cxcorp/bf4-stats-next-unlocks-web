import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import { Container, Row, Col, Badge } from "react-bootstrap";

import { LOCALSTORAGE_PERSONA_ID_KEY } from "../common";
import IdForm from "../components/IdForm";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [persistedPersonaId, setPersistedPersonaId] = useState(undefined);

  const handleFormSubmit = useCallback((id) => {
    setLoading(true);
    Router.push("/unlocks/[personaId]", `/unlocks/${id}`);
  }, []);

  useEffect(() => {
    try {
      const persistedId = localStorage.getItem(LOCALSTORAGE_PERSONA_ID_KEY);
      if (persistedId) {
        setPersistedPersonaId(persistedId);
      }
    } catch (e) {
      console.error("Failed to read persisted persona ID from localStorage", e);
    }
  }, []);

  return (
    <>
      <Head>
        <title>BF4 Next Attachment Unlocks</title>
      </Head>
      <Container>
        <Row className="pt-3 pt-sm-5 justify-content-md-center">
          <Col lg={8}>
            <h1>BF4 Next Attachment Unlocks</h1>
            <IdForm
              className="mt-5"
              defaultId={persistedPersonaId}
              loading={loading}
              onSubmit={handleFormSubmit}
            />
            <hr />
            <p>
              <Badge variant="primary" className="mr-2">
                TIP
              </Badge>
              Find the persona ID from{" "}
              <a
                href="https://battlelog.battlefield.com/bf4/"
                target="_blank"
                rel="noopener"
              >
                Battlelog
              </a>
              :
            </p>
            <p>
              <img
                src="https://github.com/cxcorp/bf4-stats-next-unlocks-scraper/raw/master/battlelog_uid.png"
                alt="Screenshot of a web browser showing the Battlelog user interface and the browser's URL bar. The ID is circled in the URL."
              />
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
