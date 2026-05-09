import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
  defineSlotRecipe,
} from "@chakra-ui/react";

const ramp = (shades: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(shades).map(([k, v]) => [k, { value: v }]),
  );

const palette = {
  pink: ramp({
    50: "#fef6fa",
    100: "#fef6fa",
    200: "#fcdcec",
    300: "#f79cc8",
    400: "#f155a0",
    500: "#de458e",
    600: "#a51359",
    700: "#4b112d",
    800: "#360606",
    900: "#360606",
  }),
  red: ramp({
    50: "#fff5f5",
    100: "#fff5f5",
    200: "#ffdede",
    300: "#ffa0a0",
    400: "#ff5c5c",
    500: "#f02d2d",
    600: "#d50b0b",
    700: "#570303",
    800: "#2a0303",
    900: "#2a0303",
  }),
  orange: ramp({
    50: "#fff9f5",
    100: "#fff9f5",
    200: "#ffead3",
    300: "#ffc382",
    400: "#ff8806",
    500: "#ec7303",
    600: "#c15100",
    700: "#562501",
    800: "#2f1604",
    900: "#2f1604",
  }),
  yellow: ramp({
    50: "#fffcf5",
    100: "#fffcf5",
    200: "#fff8d5",
    300: "#ffe58a",
    400: "#ffbd14",
    500: "#eebb04",
    600: "#855f00",
    700: "#553b06",
    800: "#312102",
    900: "#312102",
  }),
  blue: ramp({
    50: "#f5f9ff",
    100: "#f5f9ff",
    200: "#d4e5fe",
    300: "#84b4fb",
    400: "#4d93fc",
    500: "#0968f6",
    600: "#0049b8",
    700: "#002a69",
    800: "#19133a",
    900: "#19133a",
  }),
  teal: ramp({
    50: "#f7fdfd",
    100: "#f7fdfd",
    200: "#d7f4f6",
    300: "#8edfe5",
    400: "#44ccd5",
    500: "#1bbfca",
    600: "#006f93",
    700: "#07465a",
    800: "#04252f",
    900: "#04252f",
  }),
  purple: ramp({
    50: "#f6f5fe",
    100: "#f6f5fe",
    200: "#e2ddfd",
    300: "#ad9efa",
    400: "#836bff",
    500: "#583aee",
    600: "#3b1fc6",
    700: "#271a68",
    800: "#20092b",
    900: "#20092b",
  }),
  green: ramp({
    50: "#f6fef6",
    100: "#f6fef6",
    200: "#e0fae0",
    300: "#a6f0a5",
    400: "#4ce160",
    500: "#3cc14e",
    600: "#288034",
    700: "#1b561a",
    800: "#0c310d",
    900: "#0c310d",
  }),
  // Neutral ramp doubles as gray so default Chakra `colorPalette="gray"` lands here.
  neutral: ramp({
    50: "#ffffff",
    100: "#ffffff",
    200: "#f7f7f7",
    300: "#e5e5e5",
    400: "#e0e0e0",
    500: "#8f8f8f",
    600: "#616161",
    700: "#363636",
    800: "#191919",
    900: "#000000",
  }),
  gray: ramp({
    50: "#ffffff",
    100: "#ffffff",
    200: "#f7f7f7",
    300: "#e5e5e5",
    400: "#e0e0e0",
    500: "#8f8f8f",
    600: "#616161",
    700: "#363636",
    800: "#191919",
    900: "#000000",
  }),
};

// Helper text — small, themed by status. Themed via the `tone` variant.
const helperTextRecipe = defineRecipe({
  className: "agentic-helper-text",
  base: {
    fontFamily: "body",
    fontSize: "13px",
    lineHeight: "15px",
    fontWeight: "400",
    display: "inline-flex",
    alignItems: "center",
    gap: "2",
    px: "3",
    py: "2",
    borderRadius: "sm",
  },
  variants: {
    tone: {
      neutral: { bg: "bg.subtle", color: "fg.muted" },
      success: { bg: "bg.successSubtle", color: "fg.success" },
      error: { bg: "bg.attentionSubtle", color: "fg.attention" },
      warning: { bg: "bg.warningSubtle", color: "fg.warning" },
    },
  },
  defaultVariants: { tone: "neutral" },
});

// Table — matches Figma cell-header (bg.subtle, Departure Mono 12/18 uppercase,
// 40h, 24px x-padding) and cell-type-* (white bg, Geist 14/18, 64h, 16px x-padding,
// 1px border.muted bottom). size="sm" gives compact 40h cells.
const tableSlotRecipe = defineSlotRecipe({
  className: "agentic-table",
  slots: ["root", "header", "body", "row", "cell", "columnHeader", "caption", "footer"],
  base: {
    root: {
      fontFamily: "body",
      color: "fg",
      width: "full",
      borderCollapse: "collapse",
      captionSide: "bottom",
    },
    header: {
      bg: "bg.subtle",
    },
    body: {
      bg: "bg",
    },
    row: {
      bg: "bg",
      transitionProperty: "background-color",
      transitionDuration: "fast",
    },
    columnHeader: {
      fontFamily: "mono",
      textTransform: "uppercase",
      letterSpacing: "wide",
      fontWeight: "500",
      fontSize: "12px",
      lineHeight: "18px",
      color: "fg.muted",
      bg: "bg.subtle",
      h: "10",
      px: "6",
      py: "3",
      textAlign: "start",
      whiteSpace: "nowrap",
      verticalAlign: "middle",
    },
    cell: {
      fontFamily: "body",
      fontSize: "14px",
      lineHeight: "18px",
      color: "fg",
      h: "16",
      px: "4",
      py: "3",
      borderBottomWidth: "1px",
      borderColor: "border.muted",
      verticalAlign: "middle",
    },
    caption: {
      fontFamily: "mono",
      textTransform: "uppercase",
      letterSpacing: "wide",
      fontSize: "12px",
      lineHeight: "18px",
      color: "fg.muted",
      px: "4",
      py: "3",
    },
    footer: {
      fontFamily: "body",
      fontSize: "13px",
      color: "fg.muted",
      bg: "bg.subtle",
    },
  },
  variants: {
    size: {
      sm: {
        columnHeader: { h: "8", px: "3", py: "2", fontSize: "11px" },
        cell: { h: "10", px: "3", py: "2", fontSize: "13px", lineHeight: "16px" },
      },
      md: {},
    },
    interactive: {
      true: {
        row: {
          cursor: "pointer",
          _hover: { bg: "bg.subtle" },
        },
      },
    },
    striped: {
      true: {
        row: {
          _even: { bg: "bg.subtle" },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Dialog — modal sheet matching Figma SYSTEM/MODAL.
// Layout: 480w, 24px gap stack inside 24px padding, 16px radius,
// 0.5px subtle border, elevation 4 shadow, pill close trigger top-right.
// Type: title in heading family at 20/24, description in body 16/24.
const dialogSlotRecipe = defineSlotRecipe({
  className: "agentic-dialog",
  slots: [
    "trigger",
    "backdrop",
    "positioner",
    "content",
    "header",
    "body",
    "footer",
    "title",
    "description",
    "closeTrigger",
  ],
  base: {
    backdrop: {
      bg: "blackAlpha.400",
      pos: "fixed",
      inset: 0,
    },
    positioner: {
      display: "flex",
      pos: "fixed",
      inset: 0,
      p: "4",
      overflow: "auto",
    },
    content: {
      pos: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "6",
      p: "6",
      bg: "bg",
      color: "fg",
      borderWidth: "0.5px",
      borderColor: "border",
      borderRadius: "2xl",
      boxShadow: "dialog",
      outline: "0",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "1",
      p: "0",
    },
    body: {
      p: "0",
      flex: "1",
      fontFamily: "body",
      fontSize: "14px",
      lineHeight: "18px",
      color: "fg",
    },
    footer: {
      display: "flex",
      alignItems: "center",
      gap: "2.5",
      p: "0",
    },
    title: {
      fontFamily: "heading",
      fontWeight: "400",
      fontSize: "20px",
      lineHeight: "24px",
      letterSpacing: "tight",
      color: "fg",
    },
    description: {
      fontFamily: "body",
      fontWeight: "400",
      fontSize: "16px",
      lineHeight: "24px",
      letterSpacing: "normal",
      color: "fg.muted",
    },
    closeTrigger: {
      pos: "absolute",
      top: "3",
      insetEnd: "3",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      w: "6",
      h: "6",
      minW: "6",
      p: "0",
      bg: "bg.subtle",
      color: "fg",
      borderRadius: "full",
      cursor: "pointer",
      transitionProperty: "background-color, color",
      transitionDuration: "fast",
      _hover: { bg: "bg.muted" },
      _focusVisible: {
        outline: "none",
        boxShadow: "focusRing",
      },
    },
  },
  variants: {
    placement: {
      center: {
        positioner: { alignItems: "center", justifyContent: "center" },
        content: { mx: "auto" },
      },
      top: {
        positioner: { alignItems: "flex-start", justifyContent: "center" },
        content: { mt: "16", mx: "auto" },
      },
    },
    size: {
      sm: { content: { width: "100%", maxW: "400px" } },
      md: { content: { width: "100%", maxW: "480px" } },
      lg: { content: { width: "100%", maxW: "560px" } },
    },
    motionPreset: {
      scale: {
        content: {
          _open: { animationName: "scale-in, fade-in" },
          _closed: { animationName: "scale-out, fade-out" },
        },
      },
      "slide-in-bottom": {
        content: {
          _open: { animationName: "slide-from-bottom, fade-in" },
          _closed: { animationName: "slide-to-bottom, fade-out" },
        },
      },
      none: {},
    },
  },
  defaultVariants: {
    size: "md",
    placement: "center",
    motionPreset: "scale",
  },
});

// File upload dropzone — idle/dragging/disabled.
const fileUploadRecipe = defineRecipe({
  className: "agentic-file-upload",
  base: {
    fontFamily: "body",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "3",
    px: "6",
    py: "8",
    minH: "56",
    bg: "bg.subtle",
    color: "fg",
    borderWidth: "1px",
    borderColor: "transparent",
    borderRadius: "lg",
    transitionProperty: "background-color, border-color",
    transitionDuration: "fast",
    cursor: "pointer",
    _hover: {
      bg: "bg.muted",
      borderStyle: "dashed",
      borderColor: "border.medium",
    },
  },
  variants: {
    state: {
      idle: {},
      dragging: {
        bg: "bg.muted",
        borderStyle: "dashed",
        borderColor: "border.medium",
      },
      disabled: {
        opacity: 0.4,
        cursor: "not-allowed",
        _hover: { borderColor: "transparent", bg: "bg.subtle" },
      },
    },
  },
  defaultVariants: { state: "idle" },
});

const config = defineConfig({
  theme: {
    tokens: {
      colors: palette,
      fonts: {
        heading: {
          value:
            "var(--font-heading), Newsreader, ui-serif, Georgia, 'Times New Roman', serif",
        },
        body: {
          value:
            "var(--font-body), Geist, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        mono: {
          value:
            "var(--font-mono), 'Departure Mono', ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace",
        },
      },
      letterSpacings: {
        tight: { value: "-0.02em" },
        normal: { value: "0em" },
        wide: { value: "0.05em" },
        wider: { value: "0.12em" },
      },
      // Subtle radii matching the Figma — buttons/inputs ~2px, surfaces 4–8px.
      radii: {
        none: { value: "0" },
        xs: { value: "1px" },
        sm: { value: "2px" },
        md: { value: "4px" },
        lg: { value: "8px" },
        xl: { value: "12px" },
        "2xl": { value: "16px" },
        "3xl": { value: "20px" },
        full: { value: "9999px" },
      },
      shadows: {
        // Figma: Components/Focus — 2px blue ring with 1px halo.
        focusRing: {
          value:
            "0 0 0 1px #ffffff, 0 0 0 3px rgba(9, 104, 246, 0.5)",
        },
        // Figma: Shadows/elevation2 — popover/menu drop.
        menu: {
          value:
            "0 8px 16px -8px rgba(0,0,0,0.04), 0 6px 6px -3px rgba(0,0,0,0.04), 0 3px 3px -1.5px rgba(0,0,0,0.04), 0 1px 1px -0.5px rgba(0,0,0,0.04)",
        },
        // Figma: Shadows/elevation4 — modal/dialog float. The system is flat
        // by doctrine, but a dialog is detached float (same exception as menu).
        dialog: {
          value:
            "0 0 0 1px rgba(0,0,0,0.08), 0 1px 1px -0.5px rgba(0,0,0,0.04), 0 3px 3px rgba(0,0,0,0.04), 0 6px 6px rgba(0,0,0,0.04), 0 12px 12px rgba(0,0,0,0.04), 0 16px 16px rgba(0,0,0,0.04)",
        },
      },
    },
    semanticTokens: {
      colors: {
        fg: {
          DEFAULT: {
            value: { base: "{colors.neutral.800}", _dark: "{colors.neutral.100}" },
          },
          muted: {
            value: { base: "{colors.neutral.600}", _dark: "{colors.neutral.500}" },
          },
          subtle: {
            value: { base: "{colors.neutral.500}", _dark: "{colors.neutral.600}" },
          },
          inverted: {
            value: { base: "{colors.neutral.100}", _dark: "{colors.neutral.800}" },
          },
          icon: {
            value: { base: "{colors.neutral.500}", _dark: "{colors.neutral.500}" },
          },
          disabled: {
            value: { base: "{colors.neutral.400}", _dark: "{colors.neutral.700}" },
          },
          success: {
            value: { base: "{colors.green.700}", _dark: "{colors.green.300}" },
          },
          warning: {
            value: { base: "{colors.yellow.600}", _dark: "{colors.yellow.300}" },
          },
          attention: {
            value: { base: "{colors.red.700}", _dark: "{colors.red.300}" },
          },
        },
        bg: {
          DEFAULT: {
            value: { base: "{colors.neutral.100}", _dark: "{colors.neutral.900}" },
          },
          subtle: {
            value: { base: "{colors.neutral.200}", _dark: "{colors.neutral.800}" },
          },
          muted: {
            value: { base: "{colors.neutral.300}", _dark: "{colors.neutral.700}" },
          },
          inverted: {
            value: { base: "{colors.neutral.800}", _dark: "{colors.neutral.100}" },
          },
          // Helper-text/banner backgrounds.
          successSubtle: {
            value: { base: "{colors.green.200}", _dark: "{colors.green.800}" },
          },
          warningSubtle: {
            value: { base: "{colors.yellow.200}", _dark: "{colors.yellow.800}" },
          },
          attention: {
            value: { base: "{colors.red.600}", _dark: "{colors.red.500}" },
          },
          attentionSubtle: {
            value: { base: "{colors.red.200}", _dark: "{colors.red.800}" },
          },
        },
        border: {
          DEFAULT: {
            value: { base: "{colors.neutral.300}", _dark: "{colors.neutral.700}" },
          },
          muted: {
            value: { base: "{colors.neutral.200}", _dark: "{colors.neutral.800}" },
          },
          medium: {
            value: { base: "{colors.neutral.500}", _dark: "{colors.neutral.500}" },
          },
          strong: {
            value: { base: "{colors.neutral.800}", _dark: "{colors.neutral.100}" },
          },
        },
        // Button-specific surface colors (Figma BUTTON/* tokens).
        buttonPrimary: {
          DEFAULT: {
            value: { base: "{colors.neutral.900}", _dark: "{colors.neutral.100}" },
          },
          fg: {
            value: { base: "{colors.neutral.100}", _dark: "{colors.neutral.900}" },
          },
        },
        buttonDisabled: {
          DEFAULT: {
            value: { base: "{colors.neutral.200}", _dark: "{colors.neutral.700}" },
          },
          fg: {
            value: { base: "{colors.neutral.400}", _dark: "{colors.neutral.500}" },
          },
        },
      },
    },
    recipes: {
      heading: {
        base: {
          fontFamily: "heading",
          fontWeight: "400",
          letterSpacing: "tight",
          color: "fg",
          lineHeight: "1.05",
        },
      },
      text: {
        base: {
          fontFamily: "body",
          color: "fg",
        },
      },
      // Button — Departure Mono uppercase labels, near-square corners.
      // Sizes match Figma: lg=40h, md=32h, sm=24h.
      // Variants: solid (primary/black), outline (secondary), ghost, plain (no bg).
      // Use colorPalette="red" + variant="solid" for destructive.
      button: {
        base: {
          fontFamily: "mono",
          textTransform: "uppercase",
          fontWeight: "600",
          letterSpacing: "normal",
          borderRadius: "sm",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2",
          transitionProperty: "background-color, color, border-color, box-shadow",
          transitionDuration: "fast",
          _focusVisible: {
            outline: "none",
            boxShadow: "focusRing",
          },
          _disabled: {
            cursor: "not-allowed",
            bg: "buttonDisabled",
            color: "buttonDisabled.fg",
            borderColor: "border.muted",
          },
        },
        variants: {
          size: {
            lg: {
              h: "10",
              minW: "10",
              px: "4",
              fontSize: "13px",
              lineHeight: "15px",
            },
            md: {
              h: "8",
              minW: "8",
              px: "4",
              fontSize: "13px",
              lineHeight: "15px",
            },
            sm: {
              h: "6",
              minW: "6",
              px: "2",
              fontSize: "10px",
              lineHeight: "11px",
              gap: "1",
            },
          },
          variant: {
            solid: {
              bg: "buttonPrimary",
              color: "buttonPrimary.fg",
              _hover: { bg: "neutral.700" },
              _active: { bg: "neutral.600" },
            },
            outline: {
              bg: "bg",
              color: "fg",
              borderWidth: "1px",
              borderColor: "border",
              _hover: { bg: "bg.subtle" },
              _active: { bg: "bg.muted" },
            },
            ghost: {
              bg: "transparent",
              color: "fg",
              _hover: { bg: "bg.subtle" },
              _active: { bg: "bg.muted" },
            },
            plain: {
              bg: "transparent",
              color: "fg",
              _hover: { color: "fg.muted" },
            },
            // Keep destructive nameable directly; users can also use colorPalette="red".
            destructive: {
              bg: "bg.attention",
              color: "neutral.100",
              _hover: { bg: "red.700" },
              _active: { bg: "red.800" },
              _disabled: {
                bg: "bg.attentionSubtle",
                color: "red.300",
                borderColor: "transparent",
              },
            },
          },
        },
      },
      link: {
        base: {
          fontFamily: "mono",
          textTransform: "uppercase",
          fontWeight: "500",
          letterSpacing: "wide",
          textUnderlineOffset: "0.25em",
          color: "fg",
          _hover: { color: "fg.muted" },
        },
      },
      // Form fields — DropdownMenu / Input.
      // 40h, 1px subtle border, Geist 14/18 body, dark text on white.
      input: {
        base: {
          fontFamily: "body",
          fontSize: "14px",
          lineHeight: "18px",
          color: "fg",
          bg: "bg",
          h: "10",
          px: "3",
          borderWidth: "1px",
          borderColor: "border",
          borderRadius: "sm",
          _placeholder: { color: "fg.muted" },
          _hover: { borderColor: "border.medium" },
          _focusVisible: {
            outline: "none",
            borderColor: "border.medium",
            boxShadow: "focusRing",
          },
          _disabled: {
            bg: "bg.subtle",
            color: "fg.disabled",
            cursor: "not-allowed",
            _placeholder: { color: "fg.disabled" },
          },
        },
      },
      helperText: helperTextRecipe,
      fileUpload: fileUploadRecipe,
    },
    slotRecipes: {
      table: tableSlotRecipe,
      // Menu — popover with subtle border + elevation.
      menu: {
        slots: ["content", "item", "trigger", "indicator", "itemGroup", "itemGroupLabel", "separator"],
        base: {
          content: {
            bg: "bg",
            borderWidth: "1px",
            borderColor: "border",
            borderRadius: "sm",
            boxShadow: "menu",
            py: "1",
            minW: "40",
          },
          item: {
            fontFamily: "body",
            fontSize: "14px",
            lineHeight: "18px",
            color: "fg",
            px: "3",
            py: "2",
            borderRadius: "0",
            cursor: "pointer",
            _hover: { bg: "bg.subtle" },
            _focus: { bg: "bg.subtle" },
            _highlighted: { bg: "bg.subtle" },
            _selected: { bg: "bg.subtle", fontWeight: "500" },
            _disabled: { color: "fg.disabled", cursor: "not-allowed" },
          },
          itemGroupLabel: {
            fontFamily: "mono",
            textTransform: "uppercase",
            fontSize: "10px",
            letterSpacing: "wide",
            color: "fg.muted",
            px: "3",
            py: "1",
          },
          separator: {
            borderColor: "border.muted",
          },
        },
      },
      dialog: dialogSlotRecipe,
      // Select / NativeSelect — same field styling as Input, with chevron from default.
      select: {
        slots: ["trigger", "content", "item", "indicator", "label"],
        base: {
          trigger: {
            fontFamily: "body",
            fontSize: "14px",
            lineHeight: "18px",
            color: "fg",
            bg: "bg",
            h: "10",
            px: "3",
            borderWidth: "1px",
            borderColor: "border",
            borderRadius: "sm",
            _placeholder: { color: "fg.muted" },
            _hover: { borderColor: "border.medium" },
            _focusVisible: {
              outline: "none",
              borderColor: "border.medium",
              boxShadow: "focusRing",
            },
          },
          content: {
            bg: "bg",
            borderWidth: "1px",
            borderColor: "border",
            borderRadius: "sm",
            boxShadow: "menu",
          },
          item: {
            fontFamily: "body",
            fontSize: "14px",
            color: "fg",
            px: "3",
            py: "2",
            _hover: { bg: "bg.subtle" },
            _selected: { bg: "bg.subtle", fontWeight: "500" },
          },
        },
      },
    },
  },
  globalCss: {
    "html, body": {
      bg: "bg",
      color: "fg",
      fontFamily: "body",
    },
    "::selection": {
      bg: "neutral.800",
      color: "neutral.100",
    },
  },
});

export const system = createSystem(defaultConfig, config);
