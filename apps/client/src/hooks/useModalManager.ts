import { useState } from "react";

type ModalState<TType extends string, TData> = {
  type: TType | null;
  data: TData | null;
};

export function useModalManager<TType extends string, TData = unknown>() {
  const [modal, setModal] = useState<ModalState<TType, TData>>({
    type: null,
    data: null,
  });

  const openModal = (type: TType, data: TData | null) =>
    setModal({ type, data });

  const closeModal = () => setModal({ type: null, data: null });

  const isOpen = (type: TType) => modal.type === type;

  return { modal, openModal, closeModal, isOpen };
}
