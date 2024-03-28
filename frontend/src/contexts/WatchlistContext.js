import React, { createContext, useContext, useState } from "react";

const WatchlistContext = createContext();

export const useWatchlistData = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(null);

//   const getWatchlistResponse = await fetch(
//     "http://localhost:5000/api/watchlist/get-watchlist"
//   );
//   const getWatchlistData = await getWatchlistResponse.json();
//   setWatchlist(getWatchlistData);

  const value = {
    watchlist,
    setWatchlist
  }

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );

}

