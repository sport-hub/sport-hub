import React from "react";
import { useLazyQuery } from "react-apollo";

export function useDebouncedQuery(schema) {
  const [doQuery, {...rest}] = useLazyQuery(schema);

  const query = React.useCallback(debounce(doQuery, 600), []);

  return [query, {
      ...rest
  }]
}

function debounce(func, wait) {
  let timeout;

  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};