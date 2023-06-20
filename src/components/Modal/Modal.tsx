import React, { useCallback, useState } from "react";

export const useModal = () => {
  const [isOpen, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const open = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  return {isOpen, close, open}
};
