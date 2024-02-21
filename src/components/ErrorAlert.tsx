import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Props {
  errorMessage: String
}

const ErrorAlert: React.FC<Props> = ({ errorMessage}) => {

  // Uses useState hook to trigger the visibility of the component
  const [visible, setVisible] = useState(true);

  // Uses the useEffect state to trigger the visibility after the component renders
  useEffect(() => {
    // setTimeout delays the setVisible hook function in 1.5secs (1500) after the component renders
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
        <Alert variant="error" className={cn({"opacity-0 transition-opacity duration-500 ease-in-out" : !visible})}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
    </>
  );
};

export default ErrorAlert;