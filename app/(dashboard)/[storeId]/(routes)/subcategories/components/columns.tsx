"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Category } from '@prisma/client';


export type SubCategoryColumn = {
  id: string
  name: string
  categoryName: string
  createdAt: string
}

export const columns: ColumnDef<SubCategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.categoryName
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: 'action',
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
