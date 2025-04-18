export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey || apiKey.trim() === "") {
    return false; // Empty key immediately invalid
  }

  try {
    const res = await fetch("https://mertosolutions.com/api/validate-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey }),
    });

    const json = await res.json();

    if (res.ok && json.success) {
      return true;
    }

    return false;
  } catch (error: any) {
    console.error("Error validating API key:", error?.message);
    return false;
  }
}
