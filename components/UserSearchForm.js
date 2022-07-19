import React, { useCallback, useMemo, useContext } from "react";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import { Form, Badge } from "react-bootstrap";
import debounce from "debounce-promise";

import * as BattlelogCommon from "~/domain/common";
import { usePersistedState } from "~/util/hooks";

const ClearSavedContext = React.createContext(null);

const areOptionsEqual = (a, b) =>
  a.personaName === b.personaName &&
  a.personaId === b.personaId &&
  BattlelogCommon.getPlatformIntFromSearchResult(a) ===
    BattlelogCommon.getPlatformIntFromSearchResult(b);

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

const ClearSavedMenuList = (props) => {
  const clearSaved = useContext(ClearSavedContext);
  const hasDefaultOptions = useMemo(() => {
    return (
      Array.isArray(props.selectProps.defaultOptions) &&
      props.selectProps.defaultOptions.length > 0
    );
  }, [props.selectProps.defaultOptions]);

  const isShowingDefaultOptions = useMemo(() => {
    return (
      hasDefaultOptions &&
      props.options.length === props.selectProps.defaultOptions.length &&
      props.options.every((option) =>
        props.selectProps.defaultOptions.some((defaultOption) =>
          areOptionsEqual(option, defaultOption)
        )
      )
    );
  }, [hasDefaultOptions, props.options, props.selectProps.defaultOptions]);

  return (
    <>
      <components.MenuList {...props}>
        {props.children}
        <div
          className={`wrapper ${
            !hasDefaultOptions || !isShowingDefaultOptions ? "hidden" : ""
          }`}
        >
          <span className="clear-button" onClick={clearSaved}>
            <img className="close-icon pr-1" src="/close.svg" />
            Clear saved
          </span>
        </div>
      </components.MenuList>
      <style jsx>{`
        .wrapper {
          border-top: 1px solid #ddd;
          padding: 4px 12px;
          font-size: 0.85rem;
          display: flex;
          color: #0056b3;
          background: #fbfbfc;
        }

        .clear-button {
          margin-left: auto;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .clear-button:hover {
          text-decoration: underline;
        }

        .close-icon {
          width: 14px;
          height: 14px;
        }

        .hidden {
          display: none;
        }
      `}</style>
    </>
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

const debouncedLoadSearchResults = debounce(loadSearchResults, 350);

const selectOptionLabel = (obj) => obj.personaName;
const selectOptionValue = (obj) => {
  const platformInt = BattlelogCommon.getPlatformIntFromSearchResult(obj);
  return `${obj.personaId}/${platformInt}`;
};
const selectStyles = {
  menu: (provided) => ({ ...provided, zIndex: 5, color: "#333" }),
};
const selectComponents = {
  Option: PlatformBadgeOption,
  MenuList: ClearSavedMenuList,
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
            loadOptions={debouncedLoadSearchResults}
            getOptionLabel={selectOptionLabel}
            getOptionValue={selectOptionValue}
            {...pageLoadingOpts}
          />
        </Form.Group>
      </div>
    </>
  );
};

const CachingUserSearchForm = ({ onSelect, ...props }) => {
  const [
    previousSelections,
    setPreviousSelections,
    clearPreviousSelections,
  ] = usePersistedState([], "USER-SEARCH-FORM-PREVIOUS");

  const handleSelect = useCallback(
    (selectedOption) => {
      setPreviousSelections((prev) => {
        if (prev.find((p) => areOptionsEqual(p, selectedOption))) {
          // already cached
          return prev;
        }

        return [...prev.slice(0, 5), selectedOption];
      });

      onSelect(selectedOption);
    },
    [onSelect, setPreviousSelections, areOptionsEqual]
  );

  return (
    <ClearSavedContext.Provider value={clearPreviousSelections}>
      <UserSearchForm
        {...props}
        defaultOptions={previousSelections}
        onSelect={handleSelect}
      />
    </ClearSavedContext.Provider>
  );
};

export default CachingUserSearchForm;
