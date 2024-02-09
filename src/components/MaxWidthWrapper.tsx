import { cn } from "@/lib/utils"
import { ReactNode } from "react"

// Arrow function that takes className and children properties
const MaxWidthWrapper = ({className, children}:{
  // Defines types of properties (? means optional (not needed to be passed))
  className?: string
  children: ReactNode
}) => {
  return(
    // className parameter helps us overwrite the defaults mentioned in the first parameter when using the component
    <div className={cn("mx-auto w-full max-w-screen-xl px-2.5 md:px-20", className)}>
      {children}
    </div>
  )
}
export default MaxWidthWrapper