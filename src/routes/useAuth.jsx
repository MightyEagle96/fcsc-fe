import { useEffect, useState } from "react";
import { useAppUser } from "../contexts/AppUserContext";
import { getMyProfile } from "./auth";

export function useAuth() {
  const { user, setUser } = useAppUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getMyProfile();
        if (profile) {
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        // setLoading(false);
      }
    }

    fetchProfile();
  }, [setUser]);

  return { user, loading };
}
