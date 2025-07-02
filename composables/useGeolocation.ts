import type { LocationCoordinates, GeolocationPosition } from '~/types/location'

// Géolocalisation avec gestion d'état
export const useGeolocation = () => {
  const position = ref<GeolocationPosition | null>(null)
  const error = ref<string | null>(null)
  const isLoading = ref(false)
  const isSupported = ref(false)

  // Vérifier le support de la géolocalisation
  onMounted(() => {
    isSupported.value = 'geolocation' in navigator
  })

  const getCurrentPosition = async (options: PositionOptions = {}): Promise<GeolocationPosition | null> => {
    if (!isSupported.value) {
      error.value = 'La géolocalisation n\'est pas supportée par ce navigateur'
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        const defaultOptions: PositionOptions = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
          ...options
        }

        navigator.geolocation.getCurrentPosition(
          (nativePosition) => {
            const geoPosition: GeolocationPosition = {
              coords: {
                latitude: nativePosition.coords.latitude,
                longitude: nativePosition.coords.longitude,
                accuracy: nativePosition.coords.accuracy,
                altitude: nativePosition.coords.altitude || undefined,
                altitudeAccuracy: nativePosition.coords.altitudeAccuracy || undefined,
                heading: nativePosition.coords.heading || undefined,
                speed: nativePosition.coords.speed || undefined
              },
              timestamp: nativePosition.timestamp
            }
            resolve(geoPosition)
          },
          (geoError) => {
            let message = 'Erreur de géolocalisation'
            switch (geoError.code) {
              case geoError.PERMISSION_DENIED:
                message = 'Permission de géolocalisation refusée'
                break
              case geoError.POSITION_UNAVAILABLE:
                message = 'Position indisponible'
                break
              case geoError.TIMEOUT:
                message = 'Timeout de géolocalisation'
                break
            }
            reject(new Error(message))
          },
          defaultOptions
        )
      })

      position.value = pos
      return pos
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  const watchPosition = (
    callback: (position: GeolocationPosition) => void,
    errorCallback?: (error: Error) => void,
    options: PositionOptions = {}
  ): number | null => {
    if (!isSupported.value) {
      const error = new Error('La géolocalisation n\'est pas supportée')
      errorCallback?.(error)
      return null
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
      ...options
    }

    return navigator.geolocation.watchPosition(
      (nativePosition) => {
        const geoPosition: GeolocationPosition = {
          coords: {
            latitude: nativePosition.coords.latitude,
            longitude: nativePosition.coords.longitude,
            accuracy: nativePosition.coords.accuracy,
            altitude: nativePosition.coords.altitude || undefined,
            altitudeAccuracy: nativePosition.coords.altitudeAccuracy || undefined,
            heading: nativePosition.coords.heading || undefined,
            speed: nativePosition.coords.speed || undefined
          },
          timestamp: nativePosition.timestamp
        }
        position.value = geoPosition
        callback(geoPosition)
      },
      (positionError) => {
        let message = 'Erreur de géolocalisation'
        switch (positionError.code) {
          case positionError.PERMISSION_DENIED:
            message = 'Permission de géolocalisation refusée'
            break
          case positionError.POSITION_UNAVAILABLE:
            message = 'Position indisponible'
            break
          case positionError.TIMEOUT:
            message = 'Timeout de géolocalisation'
            break
        }
        const geoError = new Error(message)
        error.value = message
        errorCallback?.(geoError)
      },
      defaultOptions
    )
  }

  const clearWatch = (watchId: number) => {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
    }
  }

  return {
    position: readonly(position),
    error: readonly(error),
    isLoading: readonly(isLoading),
    isSupported: readonly(isSupported),
    getCurrentPosition,
    watchPosition,
    clearWatch
  }
}
