"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Plus, Pen, Trash } from "lucide-react"; // For sort icons
import { useAuth } from "@/store/useAuth";
import { FullScreenLoading } from "./Loading";

interface Column {
    key: string;
    label: string;
    sortable?: boolean;
}

// Define a generic type parameter for the data
interface TableProps<T extends Record<string, unknown>> {
    data: T[];
    columns: Column[];
    onAction?: (action: string, row?: T) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTable: React.FC<TableProps<any>> = ({ data, columns, onAction }) => {
    const { isLoading } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    // Handle search
    const filteredData = data.filter((row) =>
        Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Handle sorting
    const sortedData = React.useMemo(() => {
        if (!sortConfig) return filteredData;

        return [...filteredData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, sortConfig]);

    const requestSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const emitAddAction = (action: string) => {
        onAction?.(action);
    };

    return (
        <div>
            {isLoading && <FullScreenLoading size="lg"
                color="text-green-600"
                message="Please wait while we fetch your data..." />}
            {/* Search Input */}
            <div className="flex justify-end items-center w-full">
                <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                />
                <Button variant="ghost" onClick={() => emitAddAction("add")}>
                    <Plus className="w-4 h-4 text-primary" />
                </Button>
            </div>


            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={column.key}>
                                {column.sortable ? (
                                    <Button
                                        variant="ghost"
                                        onClick={() => requestSort(column.key)}
                                    >
                                        {column.label}
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    column.label
                                )}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedData.length > 0 ? sortedData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {columns.map((column) => (
                                <TableCell key={column.key}>
                                    {column.key === "action" ? (
                                        <div className="flex gap-2 justify-end items-center w-[50px]">
                                            <Button variant="ghost" onClick={() => onAction?.("edit", row)}>
                                                <Pen className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button variant="ghost" onClick={() => onAction?.("delete", row)}>
                                                <Trash className="w-4 h-4 text-destructive" />
                                            </Button>

                                        </div>
                                    ) : (
                                        row[column.key]
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">No data found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default CustomTable;