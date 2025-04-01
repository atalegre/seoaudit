import * as React from "react"

import { cn } from "@/lib/utils"
import { useBreakpoint } from "@/hooks/use-mobile"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => {
  const { isMobile } = useBreakpoint();
  
  return (
    <div className={cn("relative w-full overflow-auto", isMobile ? "min-w-full" : "")}>
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom", 
          isMobile ? "text-xs" : "text-sm", 
          className
        )}
        {...props}
      />
    </div>
  )
})
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { isMobile } = useBreakpoint();
  
  return (
    <tfoot
      ref={ref}
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        isMobile ? "text-[10px]" : "",
        className
      )}
      {...props}
    />
  )
})
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => {
  const { isMobile } = useBreakpoint();
  
  return (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        isMobile ? "border-opacity-50" : "",
        className
      )}
      {...props}
    />
  )
})
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { breakpoint } = useBreakpoint();
  
  const sizeClasses = {
    xs: "text-[10px] h-6 px-1 py-1",
    sm: "text-[10px] h-7 px-1 py-1",
    md: "text-xs h-8 px-2 py-1",
    lg: "h-10 px-3 py-2",
    xl: "h-12 px-4 py-3"
  };
  
  return (
    <th
      ref={ref}
      className={cn(
        "text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        sizeClasses[breakpoint],
        className
      )}
      {...props}
    />
  )
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { breakpoint } = useBreakpoint();
  
  const sizeClasses = {
    xs: "p-1 py-1",
    sm: "p-1 py-2",
    md: "p-2 py-2",
    lg: "p-3 py-3",
    xl: "p-4 py-4"
  };
  
  return (
    <td
      ref={ref}
      className={cn(
        "align-middle [&:has([role=checkbox])]:pr-0", 
        sizeClasses[breakpoint],
        className
      )}
      {...props}
    />
  )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => {
  const { isMobile } = useBreakpoint();
  
  return (
    <caption
      ref={ref}
      className={cn("mt-4 text-muted-foreground", isMobile ? "text-xs" : "text-sm", className)}
      {...props}
    />
  )
})
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
