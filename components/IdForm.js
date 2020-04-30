import { useCallback } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import LoadingButton from "./LoadingButton";

const idInputName = "personaId";

const IdForm = ({ className, defaultId, loading, onSubmit }) => {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit(e.target[idInputName].value);
  }, []);

  return (
    <Form className={className} onSubmit={handleSubmit}>
      <Form.Group controlId="personaId">
        <Form.Label>BF4 persona ID</Form.Label>
        <InputGroup>
          <Form.Control
            required
            disabled={loading}
            name={idInputName}
            type="text"
            placeholder="123456789"
            minLength="1"
            maxLength="12"
            defaultValue={defaultId}
          />
          <InputGroup.Append>
            {loading ? (
              <LoadingButton type="submit" />
            ) : (
              <Button variant="primary" type="submit">
                Show next unlocks
              </Button>
            )}
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
    </Form>
  );
};

export default IdForm;
