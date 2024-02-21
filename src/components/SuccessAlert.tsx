import { CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Props {
  successMessage: String
}

const SuccessAlert: React.FC<Props> = ({ successMessage }) => {

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
        <Alert variant="success" className={cn({"opacity-0 transition-opacity duration-500 ease-in-out" : !visible})}>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
    </>
  );
};

export default SuccessAlert;