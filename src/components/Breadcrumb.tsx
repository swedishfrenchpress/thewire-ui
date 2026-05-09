"use client";

import { Breadcrumb as ChakraBreadcrumb } from "@chakra-ui/react";
import { Fragment, type ReactNode } from "react";

export const Breadcrumb = {
  Root: ChakraBreadcrumb.Root,
  List: ChakraBreadcrumb.List,
  Item: ChakraBreadcrumb.Item,
  Link: ChakraBreadcrumb.Link,
  CurrentLink: ChakraBreadcrumb.CurrentLink,
  Separator: ChakraBreadcrumb.Separator,
  Ellipsis: ChakraBreadcrumb.Ellipsis,
};

export type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  "aria-label"?: string;
};

export function Breadcrumbs({
  items,
  separator = "/",
  "aria-label": ariaLabel = "Breadcrumb",
}: BreadcrumbsProps) {
  return (
    <ChakraBreadcrumb.Root aria-label={ariaLabel}>
      <ChakraBreadcrumb.List>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={index}>
              <ChakraBreadcrumb.Item>
                {isLast ? (
                  <ChakraBreadcrumb.CurrentLink>
                    {item.label}
                  </ChakraBreadcrumb.CurrentLink>
                ) : (
                  <ChakraBreadcrumb.Link href={item.href}>
                    {item.label}
                  </ChakraBreadcrumb.Link>
                )}
              </ChakraBreadcrumb.Item>
              {!isLast && (
                <ChakraBreadcrumb.Separator>
                  {separator}
                </ChakraBreadcrumb.Separator>
              )}
            </Fragment>
          );
        })}
      </ChakraBreadcrumb.List>
    </ChakraBreadcrumb.Root>
  );
}
