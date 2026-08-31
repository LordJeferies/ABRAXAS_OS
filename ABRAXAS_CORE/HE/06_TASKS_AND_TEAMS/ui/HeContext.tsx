import React, {createContext, useContext, useState, useEffect, useCallback} from "react";
import type {HeOperationsService} from "../runtime/service.ts";
import type {TeamMember} from "../runtime/types.ts";
import type {HeNavView, HeGlobalState, ProductSession} from "./types.ts";

export type HeContextValue = {
  service: HeOperationsService;
  session: ProductSession;
  activeView: HeNavView;
  setActiveView: (view: HeNavView) => void;
  globalState: HeGlobalState;
  errorMessage: string | undefined;
  setCurrentActorId: (actorId: string) => void;
  refresh: () => void;
  bootstrapOwner: (input: {userId: string; displayName: string; email?: string}) => void;
};

const HeContext = createContext<HeContextValue | null>(null);

export const useHe = (): HeContextValue => {
  const ctx = useContext(HeContext);
  if (!ctx) throw new Error("useHe must be used within a HeProvider");
  return ctx;
};

export const HeProvider: React.FC<{
  service: HeOperationsService;
  initialActorId?: string;
  children: React.ReactNode;
}> = ({service, initialActorId, children}) => {
  const [activeView, setActiveView] = useState<HeNavView>("solo");
  const members = service.getTeamMembers();
  const initialActor = initialActorId || (members[0]?.userId ?? "");
  const [actorId, setActorId] = useState<string>(initialActor);
  const initialGlobalState: HeGlobalState = members.length === 0 ? "FIRST_RUN" : "READY";
  const [globalState, setGlobalState] = useState<HeGlobalState>(initialGlobalState);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    try {
      const currentMembers = service.getTeamMembers();
      if (currentMembers.length === 0) {
        setGlobalState("FIRST_RUN");
      } else {
        if (!actorId || !currentMembers.some((m) => m.userId === actorId)) {
          setActorId(currentMembers[0]?.userId ?? "");
        }
        setGlobalState("READY");
      }
    } catch (err) {
      setGlobalState("ERROR");
      setErrorMessage((err as Error).message);
    }
  }, [service, actorId, tick]);

  const currentMembers = service.getTeamMembers();
  const currentMember = currentMembers.find((m) => m.userId === actorId);

  const bootstrapOwner = useCallback((input: {userId: string; displayName: string; email?: string}) => {
    try {
      service.bootstrapOwner(input);
      setActorId(input.userId);
      setGlobalState("READY");
      refresh();
    } catch (err) {
      setGlobalState("ERROR");
      setErrorMessage((err as Error).message);
    }
  }, [service, refresh]);

  const value: HeContextValue = {
    service,
    session: {
      currentActorId: actorId,
      currentMember,
      availableMembers: currentMembers
    },
    activeView,
    setActiveView,
    globalState,
    errorMessage,
    setCurrentActorId: setActorId,
    refresh,
    bootstrapOwner
  };

  return <HeContext.Provider value={value}>{children}</HeContext.Provider>;
};
