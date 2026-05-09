"use client";

import { Menu, Portal, chakra } from "@chakra-ui/react";

const StyledButton = chakra("button");

export type CaseMenuAction = "rename" | "pin" | "delete";

type Props = {
  pinned: boolean;
  onSelect: (action: CaseMenuAction) => void;
};

export function CaseCardMenu({ pinned, onSelect }: Props) {
  return (
    <Menu.Root
      positioning={{ placement: "bottom-end" }}
      onSelect={(details) => onSelect(details.value as CaseMenuAction)}
    >
      <Menu.Trigger asChild>
        <StyledButton
          type="button"
          aria-label="Case actions"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") e.stopPropagation();
          }}
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          w="7"
          h="7"
          bg="transparent"
          color="fg.muted"
          borderRadius="sm"
          cursor="pointer"
          transition="background-color 150ms, color 150ms"
          _hover={{ color: "fg", bg: "bg.subtle" }}
          _focusVisible={{ outline: "none", boxShadow: "focusRing" }}
        >
          <DotsIcon />
        </StyledButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content minW="180px">
            <Menu.Item value="rename">Rename</Menu.Item>
            <Menu.Item value="pin">{pinned ? "Unpin" : "Pin"}</Menu.Item>
            <Menu.Separator />
            <Menu.Item value="delete" color="fg.attention">
              Delete from index
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

function DotsIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}
