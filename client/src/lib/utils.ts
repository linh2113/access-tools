import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}
export const formatCurrency = (number: number) => {
   return number?.toLocaleString() + 'đ'
}
export const productKey = [
   { key: 'product_name', name: 'Tên sản phẩm' },
   { key: 'price', name: 'Giá' },
   { key: 'weight', name: 'Cân nặng' },
   { key: 'resolution', name: 'Độ phân giải' },
   { key: 'sensor', name: 'Cảm biến' },
   { key: 'connectivity', name: 'Kết nối' },
   { key: 'battery', name: 'Pin' },
   { key: 'compatibility', name: 'Tương thích' },
   { key: 'manufacturer', name: 'Nhà sản xuất' },
   { key: 'length', name: 'Chiều dài' },
   { key: 'width', name: 'Chiều rộng' },
   { key: 'height', name: 'Chiều cao' },
   { key: 'source', name: 'Nguồn' }
]
export function formatWeight(weight: string): string {
   const parsedWeight = parseInt(weight)
   return `${parsedWeight}g`
}

export function formatSize(size: string): string {
   const parsedSize = parseFloat(size)
   return `${parsedSize}mm`
}
export function formatPrice(priceString: string) {
   const price = Number(priceString)
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0 // Không hiển thị số lẻ
   }).format(price)
}
export const generateRandomColor = () => {
   const randomColor = () => Math.floor(Math.random() * 256) // Generate a number between 0 and 255
   return `rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`
}
