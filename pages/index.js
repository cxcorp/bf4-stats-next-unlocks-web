import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import { Container, Row, Col, Badge } from "react-bootstrap";

import { LOCALSTORAGE_PERSONA_ID_KEY } from "../common";
import IdForm from "../components/IdForm";
import UserSearchForm from "../components/UserSearchForm";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [persistedPersonaId, setPersistedPersonaId] = useState(undefined);

  const handleFormSubmit = useCallback((id) => {
    setLoading(true);
    Router.push("/unlocks/[personaId]", `/unlocks/${id}`);
  }, []);

  const handleUserSearchFormSelected = useCallback(({ personaId }) => {
    handleFormSubmit(personaId);
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
        <Row className="pt-3 pt-sm-5">
          <Col lg={9}>
            <h1>BF4 Next Attachment Unlocks</h1>
            <UserSearchForm
              className="mt-5"
              onSelect={handleUserSearchFormSelected}
            />
            <IdForm
              className="mt-3"
              defaultId={persistedPersonaId}
              loading={loading}
              onSubmit={handleFormSubmit}
            />
            <hr />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
