import type { Location } from '~/types'

interface MapOptions {
  center?: [number, number] // [latitude, longitude]
  zoom?: number
  markers?: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  onMapClick?: (coordinates: [number, number]) => void
}

interface MapMarker {
  id: string
  position: [number, number]
  title?: string
  description?: string
  icon?: string
  color?: string
  location?: Location
}

interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export const useMap = () => {
  const map = ref<any>(null)
  const mapContainer = ref<HTMLElement | null>(null)
  const markers = ref<MapMarker[]>([])
  const center = ref<[number, number]>([48.8566, 2.3522]) // Paris par défaut
  const zoom = ref(13)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Initialize map (exemple avec Leaflet, adaptable à d'autres libs)
  const initMap = async (options: MapOptions = {}) => {
    try {
      loading.value = true
      error.value = null

      if (!mapContainer.value) {
        throw new Error('Container de carte non trouvé')
      }

      // Dynamically import map library to avoid SSR issues
      const L = await import('leaflet')
      
      // Set initial options
      if (options.center) center.value = options.center
      if (options.zoom) zoom.value = options.zoom
      if (options.markers) markers.value = options.markers

      // Create map instance
      map.value = L.default.map(mapContainer.value).setView(center.value, zoom.value)

      // Add tile layer
      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.value)

      // Add markers
      addMarkers(markers.value)

      // Set up event listeners
      if (options.onMapClick) {
        map.value.on('click', (e: any) => {
          options.onMapClick?.([e.latlng.lat, e.latlng.lng])
        })
      }

      // Update center and zoom when map moves
      map.value.on('moveend', () => {
        const mapCenter = map.value.getCenter()
        center.value = [mapCenter.lat, mapCenter.lng]
        zoom.value = map.value.getZoom()
      })

    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'initialisation de la carte'
      console.error('Map initialization error:', err)
    } finally {
      loading.value = false
    }
  }

  const addMarker = async (marker: MapMarker) => {
    if (!map.value) return

    try {
      const L = await import('leaflet')
      
      const leafletMarker = L.default.marker(marker.position)
        .addTo(map.value)

      if (marker.title || marker.description) {
        leafletMarker.bindPopup(`
          <div>
            ${marker.title ? `<h3>${marker.title}</h3>` : ''}
            ${marker.description ? `<p>${marker.description}</p>` : ''}
          </div>
        `)
      }

      markers.value.push(marker)
      
      return leafletMarker
    } catch (err) {
      console.error('Error adding marker:', err)
      return null
    }
  }

  const addMarkers = async (markersToAdd: MapMarker[]) => {
    for (const marker of markersToAdd) {
      await addMarker(marker)
    }
  }

  const removeMarker = (markerId: string) => {
    markers.value = markers.value.filter(m => m.id !== markerId)
    // Note: In a real implementation, you'd also remove the marker from the map
  }

  const clearMarkers = () => {
    markers.value = []
    // Note: In a real implementation, you'd also clear all markers from the map
  }

  const flyTo = (coordinates: [number, number], zoomLevel?: number) => {
    if (!map.value) return

    const targetZoom = zoomLevel || zoom.value
    map.value.flyTo(coordinates, targetZoom)
    center.value = coordinates
    zoom.value = targetZoom
  }

  const fitBounds = (bounds: MapBounds, padding = 20) => {
    if (!map.value) return

    const L = require('leaflet')
    const leafletBounds = L.latLngBounds([
      [bounds.south, bounds.west],
      [bounds.north, bounds.east]
    ])
    
    map.value.fitBounds(leafletBounds, { padding: [padding, padding] })
  }

  const getBounds = (): MapBounds | null => {
    if (!map.value) return null

    const bounds = map.value.getBounds()
    return {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest()
    }
  }

  const getDistance = (point1: [number, number], point2: [number, number]): number => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = point1[0] * Math.PI / 180
    const φ2 = point2[0] * Math.PI / 180
    const Δφ = (point2[0] - point1[0]) * Math.PI / 180
    const Δλ = (point2[1] - point1[1]) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  const destroy = () => {
    if (map.value) {
      map.value.remove()
      map.value = null
    }
    markers.value = []
    error.value = null
  }

  // Geocoding functions
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      // Using a simple geocoding service (replace with your preferred service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat)
        const lon = parseFloat(data[0].lon)
        return [lat, lon]
      }
      
      return null
    } catch (err) {
      console.error('Geocoding error:', err)
      return null
    }
  }

  const reverseGeocode = async (coordinates: [number, number]): Promise<string | null> => {
    try {
      const [lat, lon] = coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      )
      const data = await response.json()
      
      return data?.display_name || null
    } catch (err) {
      console.error('Reverse geocoding error:', err)
      return null
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    destroy()
  })

  return {
    map: readonly(map),
    mapContainer,
    markers: readonly(markers),
    center: readonly(center),
    zoom: readonly(zoom),
    loading: readonly(loading),
    error: readonly(error),
    initMap,
    addMarker,
    addMarkers,
    removeMarker,
    clearMarkers,
    flyTo,
    fitBounds,
    getBounds,
    getDistance,
    geocodeAddress,
    reverseGeocode,
    destroy
  }
}
