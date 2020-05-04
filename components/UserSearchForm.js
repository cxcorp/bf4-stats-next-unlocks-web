import { useCallback } from "react";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import { Form, Badge } from "react-bootstrap";

import * as BattlelogCommon from "../data/common";

const PlatformBadgeOption = (props) => {
  const label = props.children;
  const platform = BattlelogCommon.namespaceToPlatform(props.data.namespace);
  return (
    <components.Option {...props}>
      <Badge variant="light">
        {platform === "xbox360" ? "XBOX 360" : platform.toUpperCase()}
      </Badge>{" "}
      {label}
    </components.Option>
  );
};

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

const selectOptionLabel = (obj) => obj.personaName;
const selectOptionValue = (obj) => obj.personaId;
const selectStyles = { menu: (provided) => ({ ...provided, zIndex: 5 }) };
const selectComponents = {
  Option: PlatformBadgeOption,
};

const UserSearchForm = ({
  className,
  instanceId = "user-search-form",
  onSelect,
}) => {
  const handleChange = useCallback(
    (selectedOption, { action }) => {
      if (action === "select-option") {
        onSelect(selectedOption);
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
            styles={selectStyles}
            components={selectComponents}
            onChange={handleChange}
            instanceId={instanceId}
            defaultOptions
            cacheOptions
            loadOptions={loadSearchResults}
            getOptionLabel={selectOptionLabel}
            getOptionValue={selectOptionValue}
          />
        </Form.Group>
      </div>
    </>
  );
};

export default UserSearchForm;
