import { deleteSession } from "@/session"
import { useRouter } from "next/navigation";

// Custom hook implemented to logout the user
export const useAuth = () => {
  const router = useRouter();
  const logout = async () => {
    const session = await deleteSession()
    router.push("/login")
    router.refresh()
  }
  return {logout};
}
