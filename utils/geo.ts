import type { LocationCoordinates, GeolocationPosition } from '~/types/location'

// Géolocalisation
export function getCurrentPosition(options: PositionOptions = {}): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La géolocalisation n\'est pas supportée par ce navigateur'))
      return
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
      ...options
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const geoPosition: GeolocationPosition = {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined
          },
          timestamp: position.timestamp
        }
        resolve(geoPosition)
      },
      (error) => {
        let message = 'Erreur de géolocalisation'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Permission de géolocalisation refusée'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Position indisponible'
            break
          case error.TIMEOUT:
            message = 'Timeout de géolocalisation'
            break
        }
        reject(new Error(message))
      },
      defaultOptions
    )
  })
}

export function watchPosition(
  callback: (position: GeolocationPosition) => void,
  errorCallback?: (error: Error) => void,
  options: PositionOptions = {}
): number | null {
  if (!navigator.geolocation) {
    errorCallback?.(new Error('La géolocalisation n\'est pas supportée'))
    return null
  }

  const defaultOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000, // 1 minute
    ...options
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      const geoPosition: GeolocationPosition = {
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
          heading: position.coords.heading || undefined,
          speed: position.coords.speed || undefined
        },
        timestamp: position.timestamp
      }
      callback(geoPosition)
    },
    (error) => {
      let message = 'Erreur de géolocalisation'
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Permission de géolocalisation refusée'
          break
        case error.POSITION_UNAVAILABLE:
          message = 'Position indisponible'
          break
        case error.TIMEOUT:
          message = 'Timeout de géolocalisation'
          break
      }
      errorCallback?.(new Error(message))
    },
    defaultOptions
  )
}

export function clearWatch(watchId: number): void {
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId)
  }
}

// Calculs de distance
export function calculateDistance(
  point1: LocationCoordinates,
  point2: LocationCoordinates
): number {
  const R = 6371 // Rayon de la Terre en kilomètres
  const dLat = toRadians(point2.latitude - point1.latitude)
  const dLon = toRadians(point2.longitude - point1.longitude)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) * Math.cos(toRadians(point2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function calculateBearing(
  point1: LocationCoordinates,
  point2: LocationCoordinates
): number {
  const dLon = toRadians(point2.longitude - point1.longitude)
  const lat1 = toRadians(point1.latitude)
  const lat2 = toRadians(point2.latitude)
  
  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  
  const bearing = toDegrees(Math.atan2(y, x))
  return (bearing + 360) % 360
}

// Utilitaires de conversion
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

function toDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

// Validation des coordonnées
export function isValidCoordinates(coords: LocationCoordinates): boolean {
  return coords.latitude >= -90 && coords.latitude <= 90 &&
         coords.longitude >= -180 && coords.longitude <= 180
}

export function isValidLatitude(lat: number): boolean {
  return lat >= -90 && lat <= 90
}

export function isValidLongitude(lng: number): boolean {
  return lng >= -180 && lng <= 180
}

// Formatage des coordonnées
export function formatCoordinates(
  coords: LocationCoordinates,
  precision: number = 6
): string {
  return `${coords.latitude.toFixed(precision)}, ${coords.longitude.toFixed(precision)}`
}

export function formatLatitude(lat: number, precision: number = 6): string {
  const direction = lat >= 0 ? 'N' : 'S'
  return `${Math.abs(lat).toFixed(precision)}°${direction}`
}

export function formatLongitude(lng: number, precision: number = 6): string {
  const direction = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lng).toFixed(precision)}°${direction}`
}

// Parsing des coordonnées
export function parseCoordinates(input: string): LocationCoordinates | null {
  // Format: "lat, lng" ou "lat,lng"
  const coordPattern = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/
  const match = input.trim().match(coordPattern)
  
  if (match) {
    const latitude = parseFloat(match[1])
    const longitude = parseFloat(match[2])
    
    if (isValidCoordinates({ latitude, longitude })) {
      return { latitude, longitude }
    }
  }
  
  return null
}

// Recherche d'adresse (utilise une API de géocodage)
export async function geocodeAddress(address: string): Promise<LocationCoordinates | null> {
  try {
    // Utilisation de l'API Nominatim d'OpenStreetMap (gratuite)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=fr&limit=1`
    )
    
    if (!response.ok) {
      throw new Error('Erreur lors de la recherche d\'adresse')
    }
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      }
    }
    
    return null
  } catch (error) {
    console.error('Erreur de géocodage:', error)
    return null
  }
}

// Géocodage inverse (coordonnées vers adresse)
export async function reverseGeocode(coords: LocationCoordinates): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`
    )
    
    if (!response.ok) {
      throw new Error('Erreur lors du géocodage inverse')
    }
    
    const data = await response.json()
    
    if (data && data.display_name) {
      return data.display_name
    }
    
    return null
  } catch (error) {
    console.error('Erreur de géocodage inverse:', error)
    return null
  }
}

// Détection de la zone géographique
export function isInFrance(coords: LocationCoordinates): boolean {
  // Limites approximatives de la France métropolitaine
  const franceMetropole = {
    north: 51.1,
    south: 41.3,
    east: 9.6,
    west: -5.2
  }
  
  return coords.latitude >= franceMetropole.south &&
         coords.latitude <= franceMetropole.north &&
         coords.longitude >= franceMetropole.west &&
         coords.longitude <= franceMetropole.east
}

export function isInRegion(coords: LocationCoordinates, regionBounds: {
  north: number
  south: number
  east: number
  west: number
}): boolean {
  return coords.latitude >= regionBounds.south &&
         coords.latitude <= regionBounds.north &&
         coords.longitude >= regionBounds.west &&
         coords.longitude <= regionBounds.east
}

// Calcul de centre et de limites
export function calculateCenter(points: LocationCoordinates[]): LocationCoordinates {
  if (points.length === 0) {
    throw new Error('Impossible de calculer le centre d\'un tableau vide')
  }
  
  const sum = points.reduce(
    (acc, point) => ({
      latitude: acc.latitude + point.latitude,
      longitude: acc.longitude + point.longitude
    }),
    { latitude: 0, longitude: 0 }
  )
  
  return {
    latitude: sum.latitude / points.length,
    longitude: sum.longitude / points.length
  }
}

export function calculateBounds(points: LocationCoordinates[]): {
  north: number
  south: number
  east: number
  west: number
} {
  if (points.length === 0) {
    throw new Error('Impossible de calculer les limites d\'un tableau vide')
  }
  
  return points.reduce(
    (bounds, point) => ({
      north: Math.max(bounds.north, point.latitude),
      south: Math.min(bounds.south, point.latitude),
      east: Math.max(bounds.east, point.longitude),
      west: Math.min(bounds.west, point.longitude)
    }),
    {
      north: -90,
      south: 90,
      east: -180,
      west: 180
    }
  )
}

// Utilitaires pour les cartes
export function generateMapUrl(
  coords: LocationCoordinates,
  zoom: number = 15,
  size: string = '600x400'
): string {
  // URL pour OpenStreetMap (peut être remplacé par Google Maps ou autre)
  return `https://www.openstreetmap.org/?mlat=${coords.latitude}&mlon=${coords.longitude}&zoom=${zoom}`
}

export function generateStaticMapUrl(
  coords: LocationCoordinates,
  zoom: number = 15,
  size: string = '600x400',
  markers: LocationCoordinates[] = []
): string {
  // Exemple avec l'API MapBox Static (nécessite une clé API)
  const baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static'
  const markersParam = markers.length > 0 
    ? markers.map(m => `pin-s+555555(${m.longitude},${m.latitude})`).join(',') + '/'
    : ''
  
  return `${baseUrl}/${markersParam}${coords.longitude},${coords.latitude},${zoom}/${size}?access_token=${process.env.MAPBOX_TOKEN}`
}

// Utilitaires de proximité
export function findNearestPoint(
  target: LocationCoordinates,
  points: Array<{ coords: LocationCoordinates; data: any }>
): { coords: LocationCoordinates; data: any; distance: number } | null {
  if (points.length === 0) return null
  
  let nearest = points[0]
  let minDistance = calculateDistance(target, nearest.coords)
  
  for (let i = 1; i < points.length; i++) {
    const distance = calculateDistance(target, points[i].coords)
    if (distance < minDistance) {
      minDistance = distance
      nearest = points[i]
    }
  }
  
  return {
    ...nearest,
    distance: minDistance
  }
}

export function findPointsWithinRadius(
  center: LocationCoordinates,
  radius: number, // en kilomètres
  points: Array<{ coords: LocationCoordinates; data: any }>
): Array<{ coords: LocationCoordinates; data: any; distance: number }> {
  return points
    .map(point => ({
      ...point,
      distance: calculateDistance(center, point.coords)
    }))
    .filter(point => point.distance <= radius)
    .sort((a, b) => a.distance - b.distance)
}
