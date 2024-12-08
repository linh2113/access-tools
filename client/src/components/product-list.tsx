'use client'
import React, { useEffect, useState } from 'react'
import {
   ColumnDef,
   ColumnFiltersState,
   SortingState,
   VisibilityState,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getProducts } from '@/components/app.api'
import { useQuery } from '@tanstack/react-query'
import AutoPagination from '@/components/auto-pagination'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { formatCurrency, formatSize, formatWeight, productKey } from '@/lib/utils'
import { ProductType } from '@/types/type'
export default function ProductList() {
   const pageIndex = 0
   const pageSize = 5
   const [sorting, setSorting] = useState<SortingState>([])
   const [searchColumn, setSearchColumn] = useState<string>('product_name')
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
   const [rowSelection, setRowSelection] = useState({})
   const [pagination, setPagination] = useState({
      pageIndex,
      pageSize
   })

   const columns: ColumnDef<ProductType>[] = [
      {
         accessorKey: 'id',
         header: 'ID'
      },
      {
         accessorKey: 'product_name',
         header: 'Tên sản phẩm'
      },
      {
         accessorKey: 'price',
         header: 'Giá',
         cell: ({ getValue }) => <span>{formatCurrency(Number(getValue<string>()))}</span>
      },
      {
         accessorKey: 'image',
         header: 'Hình ảnh',
         cell: ({ getValue }) => {
            if (getValue<string>().split(',')[0] !== '') {
               return (
                  <Image
                     src={getValue<string>().split(',')[0]}
                     alt='Product'
                     width={100}
                     height={100}
                     style={{ width: '100px', height: '100px' }}
                  />
               )
            }
         }
      },
      {
         accessorKey: 'weight',
         header: 'Cân nặng',
         cell: ({ getValue }) => {
            if (getValue<string>() !== null) return <span>{formatWeight(getValue<string>())}</span>
         }
      },
      {
         accessorKey: 'resolution',
         header: 'Độ phân giải'
      },
      {
         accessorKey: 'sensor',
         header: 'Cảm biến'
      },
      {
         accessorKey: 'connectivity',
         header: 'Kết nối'
      },
      {
         accessorKey: 'battery',
         header: 'Pin'
      },
      {
         accessorKey: 'compatibility',
         header: 'Tương thích'
      },
      {
         accessorKey: 'manufacturer',
         header: 'Nhà sản xuất'
      },
      {
         accessorKey: 'length',
         header: 'Chiều dài',
         cell: ({ getValue }) => {
            if (getValue<string>() !== null) return <span>{formatSize(getValue<string>())}</span>
         }
      },
      {
         accessorKey: 'width',
         header: 'Chiều rộng',
         cell: ({ getValue }) => {
            if (getValue<string>() !== null) return <span>{formatSize(getValue<string>())}</span>
         }
      },
      {
         accessorKey: 'height',
         header: 'Chiều cao',
         cell: ({ getValue }) => {
            if (getValue<string>() !== null) return <span>{formatSize(getValue<string>())}</span>
         }
      }
   ]

   const { data } = useQuery({
      queryKey: ['product'],
      queryFn: getProducts
   })
   const products = data?.data || []
   const table = useReactTable({
      data: products,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      onPaginationChange: setPagination,
      autoResetPageIndex: false,
      state: {
         sorting,
         columnFilters,
         columnVisibility,
         rowSelection,
         pagination
      }
   })
   const start = table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
   const end = Math.min(start + table.getState().pagination.pageSize - 1, products.length)
   useEffect(() => {
      table.setPagination({
         pageIndex,
         pageSize
      })
   }, [table, pageIndex])
   return (
      <>
         <div className='flex flex-col lg:flex-row lg:items-center gap-5 justify-between mb-3'>
            <h1 className='text-2xl font-bold'>Danh sách sản phẩm</h1>
            <div className='flex items-center flex-wrap gap-3'>
               <Select onValueChange={(value) => setSearchColumn(value)}>
                  <SelectTrigger className='w-[150px]'>
                     <SelectValue placeholder='Tìm kiếm theo' />
                  </SelectTrigger>
                  <SelectContent>
                     {productKey.map((item) => (
                        <SelectItem key={item.key} value={item.key}>
                           {item.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>

               <Input
                  className='w-[300px]'
                  placeholder={`Tìm kiếm sản phẩm`}
                  value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
                  onChange={(event) => table.getColumn(searchColumn)?.setFilterValue(event.target.value)}
               />
            </div>
         </div>
         <Table className='table-responsive'>
            <TableHeader>
               {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                     {headerGroup.headers.map((header) => {
                        return (
                           <TableHead key={header.id}>
                              {header.isPlaceholder
                                 ? null
                                 : flexRender(header.column.columnDef.header, header.getContext())}
                           </TableHead>
                        )
                     })}
                  </TableRow>
               ))}
            </TableHeader>
            <TableBody>
               {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                     <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => (
                           <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                           </TableCell>
                        ))}
                     </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell colSpan={columns.length} className='h-24 text-center'>
                        No results.
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>
         <div className='flex items-center sm:flex-row flex-col justify-between gap-2 p-2'>
            <div className='text-sm text-muted-foreground py-4 flex-1 '>
               Hiển thị <strong>{start}</strong>-<strong>{end}</strong> trong tổng số <strong>{products.length}</strong>{' '}
            </div>
            <div>
               <AutoPagination
                  page={table.getState().pagination.pageIndex + 1}
                  pageSize={table.getPageCount()}
                  onClick={(pageNumber) =>
                     table.setPagination({
                        pageIndex: pageNumber - 1,
                        pageSize
                     })
                  }
               />
            </div>
         </div>
      </>
   )
}
