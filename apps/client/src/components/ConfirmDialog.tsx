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
      footerActions={[
        <UIButton variant="outline" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader variant="clip" /> : "Confirm"}
        </UIButton>,
      ]}
      closeButton={
        <UIButton className="" variant="outline">
          Cancel
        </UIButton>
      }
    ></UIDrawer>
  );
}

export default ConfirmDialog;
