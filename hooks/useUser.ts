import { getMe } from "@/actions/me";

export async function useUser() {
  const me = await getMe();
  return me;
}
