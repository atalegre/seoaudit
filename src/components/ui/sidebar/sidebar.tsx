
import * as React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSidebar } from "./context";

export const SIDEBAR_WIDTH = "14rem";
export const SIDEBAR_WIDTH_MOBILE = "12rem";
export const SIDEBAR_WIDTH_ICON = "3.5rem";

interface SidebarProps extends React.ComponentProps<"div"> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none" | "hover";
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground backdrop-blur-md [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      );
    }

    // Hover-based sidebar expansion
    if (collapsible === "hover") {
      return (
        <div
          ref={ref}
          className="group/sidebar hidden md:block text-sidebar-foreground"
          {...props}
        >
          {/* Spacing div (only used for layout) */}
          <div className="relative h-svh w-[--sidebar-width-icon] transition-all duration-200 ease-linear"></div>

          {/* Fixed sidebar container */}
          <div
            className={cn(
              "fixed inset-y-0 z-30 hidden md:flex h-svh transition-all duration-200 ease-linear",
              side === "left" ? "left-0" : "right-0"
            )}
          >
            {/* Actual sidebar content with hover behavior */}
            <div
              data-sidebar="sidebar"
              className="flex h-full flex-col border-r border-sidebar-border bg-sidebar backdrop-blur-md transition-all duration-200 ease-in-out hover:w-[--sidebar-width]"
              style={{ 
                width: "var(--sidebar-width-icon)",
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON 
              } as React.CSSProperties}
            >
              {children}
            </div>
          </div>
        </div>
      );
    }

    // Fixed positioning for the sidebar, matching the provided HTML structure
    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        {...props}
      >
        {/* Sidebar spacing element */}
        <div
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.2))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        {/* Fixed sidebar container */}
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-40 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
            className
          )}
          {...props}
        >
          {/* Sidebar content */}
          <div
            data-sidebar="sidebar"
            className={cn(
              "flex h-full w-full flex-col bg-sidebar border-r border-sidebar-border backdrop-blur-md group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow",
            )}
            style={{ "--sidebar-width": SIDEBAR_WIDTH } as React.CSSProperties}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";
