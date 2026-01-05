import UIButton from "@/client/components/ui/Button";
import UIDrawer from "@/client/components/ui/Drawer";

import Loader from "./ui/Loader";

function ConfirmDialog({
  title,
  description,
  handleSubmit,
  onOpenChange,
  open,
  isLoading,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  open: boolean;
  handleSubmit: () => void;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}) {
  return (
    <UIDrawer
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
      trigger={null}
      contentClassName="h-[30vh] sm:h-[22vh]"
      footerActions={[
        <UIButton variant="outline" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader variant="clip" /> : "Confirm"}
        </UIButton>,
      ]}
      closeButton={
        <UIButton asChild className="" variant="outline">
          <span>Cancel</span>
        </UIButton>
      }
    />
  );
}

export default ConfirmDialog;
