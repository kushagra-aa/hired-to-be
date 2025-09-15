import { toast, Toaster, type ToasterProps } from "sonner";

type ToastPropType = ToasterProps;

export const makeToast = {
  success: toast.success,
  error: toast.error,
  warning: toast.warning,
  info: toast.info,
  loading: toast.loading,
};

function Toast(props: ToastPropType) {
  return (
    <>
      <Toaster {...props} />
    </>
  );
}

export default Toast;
