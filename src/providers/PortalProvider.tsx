import { ReactNode, useState, useCallback } from "react";
import { Video } from "src/types/Movie";
import createSafeContext from "src/lib/createSafeContext";

export interface PortalConsumerProps {
  setPortal: (anchor: HTMLElement | null, vidoe: Video | null) => void;
}
export interface PortalDataConsumerProps {
  anchorElement: HTMLElement | null;
  miniModalMediaData: Video | null;
}

export const [usePortal, Provider] =
  createSafeContext<PortalConsumerProps["setPortal"]>();

export const [usePortalData, PortalDataProvider] =
  createSafeContext<PortalDataConsumerProps>();

export default function PortalProvider({ children }: { children: ReactNode }) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [miniModalMediaData, setMiniModalMediaData] = useState<Video | null>(
    null
  );

  const handleChangePortal = useCallback(
    (anchor: HTMLElement | null, video: Video | null) => {
      setAnchorElement(anchor);
      setMiniModalMediaData(video);
    },
    []
  );

  return (
    <Provider
      value={handleChangePortal}
    >
      <PortalDataProvider
        value={{
          anchorElement,
          miniModalMediaData,
        }}
      >
        {children}
      </PortalDataProvider>
    </Provider>
  );
}
