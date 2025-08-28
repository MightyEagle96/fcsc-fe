import { useEffect, useState } from "react";
import { useAppUser } from "../contexts/AppUserContext";
import { getMyProfile } from "./auth";

export function useAuth() {
  const { user, setUser } = useAppUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // (async () => {
    //   const profile = await getMyProfile();
    //   if (profile) {
    //     setUser(profile);
    //   }
    //   setLoading(false);
    // })();
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
        setLoading(false);
      }
    }

    fetchProfile();
  }, [setUser]);

  return { user, loading };
}
