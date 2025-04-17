import { atom } from "jotai";

export type ApiKeyStatus = "connected" | "invalid" | "missing";

export const apiKeyStatusAtom = atom<ApiKeyStatus>("missing");
