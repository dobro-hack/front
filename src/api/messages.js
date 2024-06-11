import API_BASE_URL from "./config";

export const fetchMessages = async (page, limit) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/messages?page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw error;
  }
};
