// api/routes.js
import API_BASE_URL from "./config";

export const fetchRoutes = async (page, limit) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/routes-sql?page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch routes:", error);
    throw error;
  }
};

export const createRoute = async (route) => {
  try {
    const response = await fetch(`${API_BASE_URL}/routes-sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(route),
    });
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to create route:", error);
    throw error;
  }
};

export const fetchParks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/parks`);
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch parks:", error);
    throw error;
  }
};
