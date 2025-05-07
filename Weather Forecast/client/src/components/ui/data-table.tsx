import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowUpDown, ChevronDown, ChevronUp, Search } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    id: string;
    header: string | React.ReactNode;
    accessorKey: keyof T;
    cell?: (item: T) => React.ReactNode;
  }[];
  loading?: boolean;
  onSort?: (column: string, direction: "asc" | "desc") => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSearch?: (column: string, value: string) => void;
  searchable?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  onSort,
  sortColumn,
  sortDirection = "asc",
  onSearch,
  searchable = false,
}: DataTableProps<T>) {
  const [searchFilters, setSearchFilters] = React.useState<Record<string, string>>({});

  // Handle column header click for sorting
  const handleHeaderClick = (columnId: string) => {
    if (!onSort) return;

    const newDirection = sortColumn === columnId && sortDirection === "asc" ? "desc" : "asc";
    onSort(columnId, newDirection);
  };

  // Handle search input change
  const handleSearchChange = (columnId: string, value: string) => {
    setSearchFilters((prev) => ({ ...prev, [columnId]: value }));
    if (onSearch) {
      onSearch(columnId, value);
    }
  };

  // Render sort indicator for column headers
  const renderSortIndicator = (columnId: string) => {
    if (!onSort || sortColumn !== columnId) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }

    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="rounded-md border">
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>
                  <div className="flex flex-col">
                    <div
                      className={`flex items-center ${onSort ? "cursor-pointer" : ""}`}
                      onClick={() => onSort && handleHeaderClick(column.id)}
                    >
                      {column.header}
                      {onSort && renderSortIndicator(column.id)}
                    </div>

                    {/* Search input for searchable columns */}
                    {searchable && onSearch && (
                      <div className="mt-2">
                        <Input
                          placeholder={`Search ${column.header}...`}
                          value={searchFilters[column.id] || ""}
                          onChange={(e) => handleSearchChange(column.id, e.target.value)}
                          size={10}
                          className="h-8 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <LoadingSpinner />
                  <div className="mt-2">Loading data...</div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.cell ? column.cell(row) : String(row[column.accessorKey] || "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
