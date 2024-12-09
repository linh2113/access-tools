'use client'
import {
   getAveragePrice,
   getManufacturer,
   getPriceRange,
   getResolution,
   getTotalProducts,
   getWeight
} from '@/components/app.api'
import { Card, CardHeader } from '@/components/ui/card'
import { formatPrice, formatWeight, generateRandomColor } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)
// 6. Hiển thị data lên UI
export default function Statistics() {
   const totalProduct = useQuery({
      queryKey: ['totalProduct'],
      queryFn: getTotalProducts
   })
   const averagePrice = useQuery({
      queryKey: ['averagePrice'],
      queryFn: getAveragePrice
   })
   const priceRange = useQuery({
      queryKey: ['priceRange'],
      queryFn: getPriceRange
   })
   const weight = useQuery({
      queryKey: ['weight'],
      queryFn: getWeight
   })
   const manufacturer = useQuery({
      queryKey: ['manufacturer'],
      queryFn: getManufacturer
   })
   const manufacturerList: { manufacturer: string; product_count: number }[] = manufacturer.data?.data || []

   const resolution = useQuery({
      queryKey: ['resolution'],
      queryFn: getResolution
   })
   const resolutionList: { resolution: string; count: number }[] = resolution.data?.data || []

   // Data for charts
   const priceChartData = {
      labels: ['Average Price', 'Max Price', 'Min Price'],
      datasets: [
         {
            label: 'Price ($)',
            data: [
               averagePrice.data?.data.average_price,
               priceRange.data?.data.max_price,
               priceRange.data?.data.min_price
            ],
            backgroundColor: ['blue', 'green', 'red']
         }
      ]
   }

   const weightChartData = {
      labels: ['Average Weight', 'Max Weight', 'Min Weight'],
      datasets: [
         {
            label: 'Weight (g)',
            data: [weight.data?.data.average_weight, weight.data?.data.max_weight, weight.data?.data.min_weight],
            backgroundColor: ['blue', 'green', 'red']
         }
      ]
   }

   const manufacturerChartData = {
      labels: manufacturerList.map((item) => item.manufacturer || 'Unknown'),
      datasets: [
         {
            label: 'Manufacturer stats',
            data: manufacturerList.map((item) => item.product_count),
            backgroundColor: manufacturerList.map(() => generateRandomColor())
         }
      ]
   }

   const resolutionChartData = {
      labels: resolutionList.map((item) => item.resolution || 'Unknown'),
      datasets: [
         {
            label: 'Resolution stats',
            data: resolutionList.map((item) => item.count),
            backgroundColor: resolutionList.map(() => generateRandomColor())
         }
      ]
   }
   return (
      <>
         <h1 className='text-2xl font-bold mb-3'>Thống kê sản phẩm ({totalProduct.data?.data.total_count} sản phẩm)</h1>
         <div className='grid grid-cols-3 gap-5 mb-5'>
            <div className='col-span-1 grid grid-cols-1 gap-5'>
               <Card>
                  <CardHeader>
                     <h2 className='font-bold text-xl text-blue-600'>Giá trị</h2>
                     <div className='font-medium flex items-center justify-between'>
                        Giá trị trung bình:{' '}
                        <span className='text-blue-600'>{formatPrice(averagePrice.data?.data.average_price)}</span>
                     </div>
                     <div className='font-medium flex items-center justify-between'>
                        Giá trị cao nhất:{' '}
                        <span className='text-blue-600'>{formatPrice(priceRange.data?.data.max_price)}</span>
                     </div>
                     <div className='font-medium flex items-center justify-between'>
                        Giá trị thấp nhất:{' '}
                        <span className='text-blue-600'>{formatPrice(priceRange.data?.data.min_price)}</span>
                     </div>
                  </CardHeader>
               </Card>
               <Card>
                  <CardHeader>
                     <h2 className='font-bold text-xl text-blue-600'>Trọng lượng</h2>
                     <div className='font-medium flex items-center justify-between'>
                        Trọng lượng trung bình:{' '}
                        <span className='text-blue-600'>{formatWeight(weight.data?.data.average_weight)}</span>
                     </div>
                     <div className='font-medium flex items-center justify-between'>
                        Trọng lượng cao nhất:{' '}
                        <span className='text-blue-600'>{formatWeight(weight.data?.data.max_weight)}</span>
                     </div>
                     <div className='font-medium flex items-center justify-between'>
                        Trọng lượng thấp nhất:{' '}
                        <span className='text-blue-600'>{formatWeight(weight.data?.data.min_weight)}</span>
                     </div>
                  </CardHeader>
               </Card>
               <Card>
                  <CardHeader>
                     <h2 className='font-bold text-xl text-blue-600'>Nhà sản xuất</h2>
                     {manufacturerList.map((item, index) => (
                        <div key={index} className='font-medium flex items-center justify-between'>
                           {item.manufacturer ? item.manufacturer : 'Không rõ'}:{' '}
                           <span className='text-blue-600'>{item.product_count} sản phẩm</span>
                        </div>
                     ))}
                  </CardHeader>
               </Card>
            </div>
            <Card className='col-span-2'>
               <CardHeader>
                  <h2 className='font-bold text-xl text-blue-600'>Độ phân giải</h2>
                  {resolutionList.map((item, index) => (
                     <div key={index} className='font-medium flex items-center justify-between'>
                        <span className='break-all'>{item.resolution ? item.resolution : 'Không rõ'}: </span>
                        <span className='text-blue-600'>{item.count} sản phẩm</span>
                     </div>
                  ))}
               </CardHeader>
            </Card>
         </div>
         <div className='grid grid-cols-2 gap-5 mb-5'>
            <Card>
               <CardHeader>
                  <h2 className='font-bold text-xl text-blue-600'>Giá trị</h2>
                  <Bar data={priceChartData} />
               </CardHeader>
            </Card>
            <Card>
               <CardHeader>
                  <h2 className='font-bold text-xl text-blue-600'>Trọng lượng</h2>
                  <Bar data={weightChartData} />
               </CardHeader>
            </Card>
            <Card>
               <CardHeader>
                  <h2 className='font-bold text-xl text-blue-600'>Nhà sản xuất</h2>
                  <Bar data={manufacturerChartData} />
               </CardHeader>
            </Card>
            <Card>
               <CardHeader>
                  <h2 className='font-bold text-xl text-blue-600'>Độ phân giải</h2>
                  <Bar data={resolutionChartData} />
               </CardHeader>
            </Card>
         </div>
      </>
   )
}
