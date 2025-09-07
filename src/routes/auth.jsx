import { baseURL, httpService } from "../httpService";

export async function getMyProfile() {
  try {
    const response = await fetch(`${baseURL}/myprofile`, {
      method: "GET",
      credentials: "include", // ensures cookies are sent
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null; // not logged in or token expired
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch profile");
    }

    return await response.json();
  } catch (err) {
    console.error("getMyProfile error:", err);
    return null;
  }
}
