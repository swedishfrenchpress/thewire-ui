"use client";

import { Dialog as ChakraDialog, Portal } from "@chakra-ui/react";
import type { ReactNode } from "react";

type DialogRootProps = Omit<ChakraDialog.RootProps, "children"> & {
  children: ReactNode;
};

export function Dialog(props: DialogRootProps) {
  return <ChakraDialog.Root {...props} />;
}

Dialog.Trigger = ChakraDialog.Trigger;

Dialog.Content = function DialogContent({
  children,
  showCloseButton = true,
}: {
  children: ReactNode;
  showCloseButton?: boolean;
}) {
  return (
    <Portal>
      <ChakraDialog.Backdrop />
      <ChakraDialog.Positioner>
        <ChakraDialog.Content>
          {children}
          {showCloseButton && (
            <ChakraDialog.CloseTrigger asChild>
              <button type="button" aria-label="Close">
                <CloseIcon />
              </button>
            </ChakraDialog.CloseTrigger>
          )}
        </ChakraDialog.Content>
      </ChakraDialog.Positioner>
    </Portal>
  );
};

Dialog.Header = ChakraDialog.Header;
Dialog.Title = ChakraDialog.Title;
Dialog.Description = ChakraDialog.Description;
Dialog.Body = ChakraDialog.Body;
Dialog.Footer = ChakraDialog.Footer;
Dialog.CloseTrigger = ChakraDialog.CloseTrigger;
Dialog.ActionTrigger = ChakraDialog.ActionTrigger;

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
    >
      <path d="M3 3l10 10" />
      <path d="M13 3L3 13" />
    </svg>
  );
}
