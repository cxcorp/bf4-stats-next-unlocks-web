import { useCallback } from "react";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import { Form, Badge } from "react-bootstrap";

import * as BattlelogCommon from "~/data/common";
import { usePersistedState } from "~/util/hooks";

const PlatformBadgeOption = (props) => {
  const label = props.children;
  const platform =
    props.data &&
    BattlelogCommon.platformIntToHumanReadable(
      BattlelogCommon.getPlatformIntFromSearchResult(props.data)
    );
  return (
    <components.Option {...props}>
      {platform && (
        <Badge variant="light" className="mr-2">
          {platform}
        </Badge>
      )}
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
const selectOptionValue = (obj) => {
  const platformInt = BattlelogCommon.getPlatformIntFromSearchResult(obj);
  return `${obj.personaId}/${platformInt}`;
};
const selectStyles = { menu: (provided) => ({ ...provided, zIndex: 5 }) };
const selectComponents = {
  Option: PlatformBadgeOption,
};

const UserSearchForm = ({
  className,
  isPageLoading,
  instanceId = "user-search-form",
  onSelect,
  defaultOptions = true,
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

  const pageLoadingOpts = isPageLoading && {
    isDisabled: true,
    isLoading: true,
  };

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
            defaultOptions={defaultOptions}
            cacheOptions
            loadOptions={loadSearchResults}
            getOptionLabel={selectOptionLabel}
            getOptionValue={selectOptionValue}
            {...pageLoadingOpts}
          />
        </Form.Group>
      </div>
    </>
  );
};

const CacheingUserSearchForm = ({ onSelect, ...props }) => {
  const [previousSelections, setPreviousSelections] = usePersistedState(
    [],
    "USER-SEARCH-FORM-PREVIOUS"
  );

  const handleSelect = useCallback(
    (option) => {
      setPreviousSelections((prev) => {
        const platformInt = BattlelogCommon.getPlatformIntFromSearchResult(
          option
        );

        if (
          prev.find(
            (p) =>
              p.personaName === option.personaName &&
              p.personaId === option.personaId &&
              BattlelogCommon.getPlatformIntFromSearchResult(p) === platformInt
          )
        ) {
          // already cached
          return prev;
        }

        return [...prev, option];
      });

      onSelect(option);
    },
    [setPreviousSelections]
  );

  return (
    <UserSearchForm
      {...props}
      defaultOptions={previousSelections}
      onSelect={handleSelect}
    />
  );
};

export default CacheingUserSearchForm;
