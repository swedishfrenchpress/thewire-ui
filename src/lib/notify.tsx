"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";
import { WireToast, type WireToastTone } from "@/components/WireToast";

type Options = {
  meta?: ReactNode;
  duration?: number;
};

function fire(
  tone: WireToastTone,
  eyebrow: string,
  title: ReactNode,
  opts: Options = {},
) {
  return toast.custom(
    (id) => (
      <WireToast id={id} tone={tone} eyebrow={eyebrow} title={title} meta={opts.meta} />
    ),
    { duration: opts.duration ?? 5000 },
  );
}

export const notify = {
  filed: (title: ReactNode, opts?: Options) =>
    fire("filed", "Filed", title, opts),
  cleared: (title: ReactNode, opts?: Options) =>
    fire("cleared", "Cleared", title, opts),
  warning: (title: ReactNode, opts?: Options) =>
    fire("warning", "Warning", title, opts),
  error: (title: ReactNode, opts?: Options) =>
    fire("error", "Error", title, opts),
};
