import React from "react";
import PT from "prop-types";

export const WordBreaked = ({ text }) => {
  if (!text || typeof text !== "string") {
    return text;
  }

  return text.split(/(?=[A-Z])/).reduce((acc, word, i, arr) => {
    const isLast = i === arr.length - 1;

    if (isLast) {
      acc.push(<span key={word + i}>{word}</span>);
    } else {
      acc.push(
        <React.Fragment key={word + i}>
          <span>{word}</span>
          <wbr />
        </React.Fragment>
      );
    }

    return acc;
  }, []);
};

WordBreaked.propTypes = {
  text: PT.string,
};
