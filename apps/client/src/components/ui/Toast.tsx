import { toast, Toaster, type ToasterProps } from "sonner";

type ToastPropType = ToasterProps;

type MakeToast = (...args: Parameters<typeof toast>) => void;
export const makeToast: MakeToast = (...args) => {
  // @ts-ignore
  return toast(...args);
};

function Toast(props: ToastPropType) {
  return (
    <>
      <Toaster {...props} />
    </>
  );
}

export default Toast;
