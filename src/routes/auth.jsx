import { baseURL } from "../httpService";

// export async function getMyProfile() {
//   try {
//     const response = await fetch(`${baseURL}/myprofile`, {
//       method: "GET",
//       credentials: "include", // ensures cookies are sent
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       if (response.status === 401) {
//         return null; // not logged in or token expired
//       }
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || "Failed to fetch profile");
//     }

//     return await response.json();
//   } catch (err) {
//     console.error("getMyProfile error:", err);
//     return null;
//   }
// }

export async function getMyProfile() {
  try {
    let response = await fetch(`${baseURL}/myprofile`, {
      method: "GET",
      credentials: "include", // sends cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      // try refreshing the token
      const refreshResponse = await fetch(`${baseURL}/refresh`, {
        credentials: "include", // include refresh token cookie
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!refreshResponse.ok) {
        console.warn("Token refresh failed");
        return null; // logout user
      }

      // after refresh succeeded, retry myprofile
      response = await fetch(`${baseURL}/myprofile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch profile");
    }

    return await response.json();
  } catch (err) {
    console.error("getMyProfile error:", err);
    return null;
  }
}
