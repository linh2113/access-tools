import http from '@/lib/http'
import { ProductType } from '@/types/type'

export const getProducts = () => http.get<ProductType[]>('/products')

export const getTotalProducts = () => http.get('/products/count')
export const getAveragePrice = () => http.get('/products/average-price')
export const getPriceRange = () => http.get('/products/price-range')

export const getWeight = () => http.get('/products/weight-stats')

export const getManufacturer = () => http.get('/products/manufacturer-stats')

export const getResolution = () => http.get('/products/resolution-stats')
