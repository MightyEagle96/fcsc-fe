import { httpService } from "../httpService";

export async function getMyProfile() {
  const { data, status } = await httpService.get("myprofile");
  if (status === 200) {
    return data;
  }
  return null;
}
