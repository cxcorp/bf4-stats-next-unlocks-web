import { useCallback } from "react";
import AsyncSelect from "react-select/async";
import { Form } from "react-bootstrap";

const loadSearchResults = async (searchTerm) => {
  try {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ term: searchTerm }),
    });

    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

const getResultPersonaName = (obj) => obj.personaName;
const getResultPersonaId = (obj) => obj.personaId;
const asyncSelectStyles = { menu: (provided) => ({ ...provided, zIndex: 5 }) };

const UserSearchForm = ({
  className,
  instanceId = "user-search-form",
  onSelect,
}) => {
  const handleChange = useCallback(
    (value, { action }) => {
      if (action === "select-option") {
        onSelect(value);
        return;
      }
    },
    [onSelect]
  );

  return (
    <>
      <div className={className}>
        <Form.Group controlId={instanceId}>
          <Form.Label>Search by BF4 username</Form.Label>
          <AsyncSelect
            styles={asyncSelectStyles}
            onChange={handleChange}
            instanceId={instanceId}
            defaultOptions
            cacheOptions
            loadOptions={loadSearchResults}
            getOptionLabel={getResultPersonaName}
            getOptionValue={getResultPersonaId}
          />
        </Form.Group>
      </div>
    </>
  );
};

export default UserSearchForm;
