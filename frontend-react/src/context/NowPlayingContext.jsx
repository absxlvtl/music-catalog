import { createContext, useState } from "react";

export const NowPlayingContext = createContext();

export function NowPlayingProvider({ children }) {
  const [nowPlaying, setNowPlaying] = useState(null);

  return (
    <NowPlayingContext.Provider value={{ nowPlaying, setNowPlaying }}>
      {children}
    </NowPlayingContext.Provider>
  );
}
