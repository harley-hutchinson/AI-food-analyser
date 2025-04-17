import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { apiKeyStatusAtom } from "@/atoms/apiKey";
import { getApiKey } from "@/lib/secureStore";
import { validateApiKey } from "@/lib/helpers/validateApiKey";

export function useApiKeyStatus() {
  const setApiKeyStatus = useSetAtom(apiKeyStatusAtom);

  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = await getApiKey();

      if (!apiKey) {
        setApiKeyStatus("missing");
        return;
      }

      const isValid = await validateApiKey(apiKey);

      if (isValid) {
        setApiKeyStatus("connected");
      } else {
        setApiKeyStatus("invalid");
      }
    };

    checkApiKey();
  }, [setApiKeyStatus]);
}
