import { createContext, useContext, useReducer } from "react";
import SearchReducer from "./SearchReducer";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const initialState = {
    type: {
      technology: false,
      commerce: false,
      arts: false,
      design: false,
      medical: false,
    },
    name: "",
    state: "",
    city: "",
  };

  const [state, dispatch] = useReducer(SearchReducer, initialState);

  return (
    <SearchContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
