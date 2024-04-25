import { deleteSession } from "@/session"
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();
  const logout = async () => {
    const session = await deleteSession()
    router.push("/login")
    router.refresh()
  }
  return {logout};
}
