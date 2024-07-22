'use client';

import { isBrowser, parseUrlOrPath, searchParamsEqual } from '@/utils/helpers';
import { usePathname, useSearchParams } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface RouteTrackerContextProps {
  previousPathname: string | null;
  previousSearchParams: URLSearchParams;
  nextPathname: string | null;
  nextSearchParams: URLSearchParams;
  previousPathDirection: 'back' | 'forward' | null;
}

const RouteTrackerContext = createContext<RouteTrackerContextProps>({
  previousPathname: null,
  previousSearchParams: new URLSearchParams(),
  nextPathname: null,
  nextSearchParams: new URLSearchParams(),
  previousPathDirection: null,
});

export const RouteTrackerProvider = ({ children }: { children: ReactNode }) => {
  const [historyLength, setHistoryLength] = useState(isBrowser() ? window.history.length : 0);
  const [paths, setPaths] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentPathname, setCurrentPathname] = useState<string | null>(null);
  const [currentSearchParams, setCurrentSearchParams] = useState(new URLSearchParams());
  const [previousPathname, setPreviousPathname] = useState<string | null>(null);
  const [previousSearchParams, setPreviousSearchParams] = useState(new URLSearchParams());
  const [nextPathname, setNextPathname] = useState<string | null>(null);
  const [nextSearchParams, setNextSearchParams] = useState(new URLSearchParams());
  const [previousPathDirection, setPreviousPathDirection] = useState<'back' | 'forward' | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname === currentPathname && searchParamsEqual(searchParams, currentSearchParams)) {
      return;
    }
    setCurrentPathname(pathname);
    setCurrentSearchParams(searchParams);

    const fullPath = `${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`;

    const updatePathsAndState = (newPaths: string[], newIndex: number, direction: 'back' | 'forward' | null) => {
      setPaths(newPaths);
      setCurrentIndex(newIndex);
      setPreviousPathDirection(direction);
      const prevUrl = parseUrlOrPath(newPaths[newIndex - 1]);
      const nextUrl = parseUrlOrPath(newPaths[newIndex + 1]);
      setPreviousPathname(prevUrl.pathname);
      setPreviousSearchParams(prevUrl.searchParams);
      setNextPathname(nextUrl.pathname);
      setNextSearchParams(nextUrl.searchParams);
    };

    const historyDiff = historyLength - paths.length;
    if (window.history.length > historyLength) {
      updatePathsAndState([...paths, fullPath], paths.length, 'back');
    } else if (window.history.length < historyLength) {
      const endPos = window.history.length - historyDiff - 2;
      if (endPos > 0) {
        updatePathsAndState([...paths.slice(0, endPos), fullPath], endPos + 1, 'back');
      } else {
        updatePathsAndState([fullPath], 0, null);
      }
    } else if (paths[currentIndex + 1] === fullPath) {
      updatePathsAndState(paths, currentIndex + 1, 'back');
    } else if (paths[currentIndex - 1] === fullPath) {
      updatePathsAndState(paths, currentIndex - 1, 'forward');
    } else if (window.history.length == historyLength) {
      const endPos = window.history.length - historyDiff - 2;
      if (endPos > 0) {
        updatePathsAndState([...paths.slice(0, window.history.length - endPos), fullPath], endPos + 1, 'back');
      } else {
        updatePathsAndState([fullPath], 0, null);
      }
    } else {
      updatePathsAndState([fullPath], 0, null);
    }

    setHistoryLength(window.history.length);
  }, [pathname, searchParams]);

  return (
    <RouteTrackerContext.Provider
      value={{ previousPathname, previousSearchParams, nextPathname, nextSearchParams, previousPathDirection }}
    >
      {children}
    </RouteTrackerContext.Provider>
  );
};

export const usePreviousPathname = () => useContext(RouteTrackerContext).previousPathname;
export const usePreviousSearchParams = () => useContext(RouteTrackerContext).previousSearchParams;
export const usePreviousPathDirection = () => useContext(RouteTrackerContext).previousPathDirection;
export const useNextPathname = () => useContext(RouteTrackerContext).nextPathname;
export const useNextSearchParams = () => useContext(RouteTrackerContext).nextSearchParams;
