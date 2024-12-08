import { ModeToggle } from '@/components/mode-toggle'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProductList from '@/components/product-list'
import Statistics from '@/components/statistics'
export default function Home() {
   return (
      <>
         <ModeToggle />
         <Tabs defaultValue='products'>
            <TabsList className='grid w-full grid-cols-2'>
               <TabsTrigger value='products'>Danh sách sản phẩm</TabsTrigger>
               <TabsTrigger value='statistics'>Thông kê sản phẩm</TabsTrigger>
            </TabsList>
            <TabsContent value='products'>
               <ProductList />
            </TabsContent>
            <TabsContent value='statistics'>
               <Statistics />
            </TabsContent>
         </Tabs>
      </>
   )
}
