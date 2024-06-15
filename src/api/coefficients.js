import API_BASE_URL from "./config";

export const fetchCoefficients = async (page, limit) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coefficients?page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch coefficients:", error);
    throw error;
  }
};

export const addCoefficient = async (coefficient) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coefficients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(coefficient),
    });
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to add coefficient:", error);
    throw error;
  }
};

export const updateCoefficient = async (coefficient) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coefficients/${coefficient.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coefficient),
      }
    );
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to update coefficient:", error);
    throw error;
  }
};

export const deleteCoefficient = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coefficients/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to delete coefficient:", error);
    throw error;
  }
};
