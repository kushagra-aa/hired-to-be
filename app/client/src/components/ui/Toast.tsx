import { toast, Toaster, type ToasterProps } from "sonner";

type ToastPropType = ToasterProps;

export const makeToast = toast;

function Toast(props: ToastPropType) {
  return (
    <>
      <Toaster {...props} />
    </>
  );
}

export default Toast;
