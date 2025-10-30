import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/client/shadcn/components/ui/drawer";

export const UIDrawerTrigger = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <>
    <DrawerTrigger>{children}</DrawerTrigger>
  </>
);

function UIDrawer({
  trigger,
  children,
  closeButton,
  title,
  description,
  footerActions,
  ...props
}: {
  trigger: React.JSX.Element;
  closeButton: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  footerActions?: React.ReactNode[];
} & React.ComponentProps<typeof Drawer>) {
  return (
    <Drawer snapPoints={[1, 1.2]} activeSnapPoint={1} {...props}>
      <UIDrawerTrigger>{trigger}</UIDrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        {children}
        <DrawerFooter>
          {footerActions?.map((action) => action)}
          <DrawerClose>{closeButton}</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default UIDrawer;
