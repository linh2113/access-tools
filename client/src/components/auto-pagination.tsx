import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/components/ui/pagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
   page: number
   pageSize: number
   onClick: (pageNumber: number) => void
}

/**
Với range = 2 áp dụng cho khoảng cách đầu, cuối và xung quanh current_page
 */
const RANGE = 2

export default function AutoPagination({ page, pageSize, onClick = () => {} }: Props) {
   const renderPagination = () => {
      let dotAfter = false
      let dotBefore = false

      const renderDotBefore = (index: number) => {
         if (!dotBefore) {
            dotBefore = true
            return (
               <PaginationItem key={`before-${index}`}>
                  <PaginationEllipsis />
               </PaginationItem>
            )
         }
         return null
      }

      const renderDotAfter = (index: number) => {
         if (!dotAfter) {
            dotAfter = true
            return (
               <PaginationItem key={`after-${index}`}>
                  <PaginationEllipsis />
               </PaginationItem>
            )
         }
         return null
      }

      return Array(pageSize)
         .fill(0)
         .map((_, index) => {
            const pageNumber = index + 1

            // Điều kiện để return về ...
            if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
               return renderDotAfter(index)
            } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
               if (pageNumber < page - RANGE && pageNumber > RANGE) {
                  return renderDotBefore(index)
               } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
                  return renderDotAfter(index)
               }
            } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
               return renderDotBefore(index)
            }
            return (
               <PaginationItem key={`page-${pageNumber}`}>
                  <Button
                     onClick={() => {
                        onClick(pageNumber)
                     }}
                     variant={pageNumber === page ? 'outline' : 'ghost'}
                     className='w-9 h-9 p-0'
                  >
                     {pageNumber}
                  </Button>
               </PaginationItem>
            )
         })
   }

   return (
      <Pagination>
         <PaginationContent>
            <PaginationItem>
               <Button
                  disabled={page === 1}
                  className='h-9 p-0 px-2'
                  variant={'ghost'}
                  onClick={() => {
                     onClick(page - 1)
                  }}
               >
                  <ChevronLeft /> Previous
               </Button>
            </PaginationItem>
            {renderPagination()}
            <PaginationItem>
               <Button
                  disabled={page === pageSize}
                  className='h-9 p-0 px-2'
                  variant={'ghost'}
                  onClick={() => {
                     onClick(page + 1)
                  }}
               >
                  Next <ChevronRight />
               </Button>
            </PaginationItem>
         </PaginationContent>
      </Pagination>
   )
}
