import API_BASE_URL from "./config";

export const fetchRequests = async (page, limit) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/requests-sql?page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch requests:", error);
    throw error;
  }
};
