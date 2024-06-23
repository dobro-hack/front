const SYOMKA_BASE_URL = "https://syomka.tech";

export const sendNotification = async (title, message) => {
  try {
    const response = await fetch(`${SYOMKA_BASE_URL}/api/v1/push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, message }),
    });
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to send notification:", error);
    throw error;
  }
};
