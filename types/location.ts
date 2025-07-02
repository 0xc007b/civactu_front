// Import from user types to avoid duplication
import type { Municipality, Region } from './user'

export interface Location {
  id: string
  name: string
  address: string
  city: string
  postalCode: string
  latitude?: number
  longitude?: number
  description?: string
  regionId?: string
  municipalityId?: string
  municipality?: Municipality
  region?: Region
  type?: string
  opinionsCount?: number
  createdAt: string
  updatedAt: string
}

export interface LocationFilters {
  search?: string
  regionId?: string
  postalCode?: string
  type?: string
  hasOpinions?: boolean
  centerLat?: number
  centerLng?: number
  radius?: number
  sortBy?: 'name' | 'postalCode' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface LocationCoordinates {
  latitude: number
  longitude: number
}

export interface AddressSearchResult {
  id: string
  label: string
  address: string
  city: string
  postalCode: string
  coordinates: LocationCoordinates
  municipality?: Municipality
}

export interface GeolocationPosition {
  coords: {
    latitude: number
    longitude: number
    accuracy: number
    altitude?: number
    altitudeAccuracy?: number
    heading?: number
    speed?: number
  }
  timestamp: number
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface MapMarker {
  id: string
  position: LocationCoordinates
  title: string
  description?: string
  type: 'report' | 'opinion' | 'user' | 'municipality'
  data?: any
}

export interface LocationCreateInput {
  name: string
  address: string
  city: string
  postalCode: string
  latitude?: number
  longitude?: number
  description?: string
  regionId?: string
  municipalityId?: string
}

export interface LocationUpdateInput {
  name?: string
  address?: string
  city?: string
  postalCode?: string
  latitude?: number
  longitude?: number
  description?: string
  regionId?: string
  municipalityId?: string
}

export interface LocationSearchParams {
  query?: string
  latitude?: number
  longitude?: number
  radius?: number
  regionId?: string
  municipalityId?: string
  limit?: number
}
