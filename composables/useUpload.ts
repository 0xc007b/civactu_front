interface UploadOptions {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  onProgress?: (progress: number) => void
  onSuccess?: (response: any) => void
  onError?: (error: any) => void
}

interface UploadResponse {
  url: string
  filename: string
  size: number
  type: string
}

export const useUpload = () => {
  const { $api } = useNuxtApp()
  const notifications = useNotifications()

  const uploading = ref(false)
  const progress = ref(0)
  const error = ref<string | null>(null)

  const uploadFile = async (file: File, endpoint = '/upload', options: UploadOptions = {}) => {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      onProgress,
      onSuccess,
      onError
    } = options

    // Validate file size
    if (file.size > maxSize) {
      const errorMsg = `Le fichier est trop volumineux (max: ${formatFileSize(maxSize)})`
      error.value = errorMsg
      onError?.(new Error(errorMsg))
      notifications.error('Erreur', errorMsg)
      return null
    }

    // Validate file type if accept is specified
    if (options.accept && !isFileTypeAccepted(file, options.accept)) {
      const errorMsg = 'Type de fichier non autorisé'
      error.value = errorMsg
      onError?.(new Error(errorMsg))
      notifications.error('Erreur', errorMsg)
      return null
    }

    try {
      uploading.value = true
      progress.value = 0
      error.value = null

      const formData = new FormData()
      formData.append('file', file)

      const response = await $api.upload<{ data: UploadResponse }>(endpoint, file, (progressPercent: number) => {
        progress.value = progressPercent
        onProgress?.(progressPercent)
      })

      onSuccess?.(response.data)
      notifications.success('Upload réussi', `Le fichier "${file.name}" a été uploadé avec succès`)
      
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'upload'
      onError?.(err)
      notifications.handleApiError(err, 'Erreur lors de l\'upload du fichier')
      return null
    } finally {
      uploading.value = false
      progress.value = 0
    }
  }

  const uploadMultiple = async (files: FileList | File[], endpoint = '/upload/multiple', options: UploadOptions = {}) => {
    const fileArray = Array.from(files)
    const results: (UploadResponse | null)[] = []

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      const result = await uploadFile(file, endpoint, {
        ...options,
        onProgress: (fileProgress) => {
          const totalProgress = ((i / fileArray.length) * 100) + (fileProgress / fileArray.length)
          progress.value = Math.round(totalProgress)
          options.onProgress?.(Math.round(totalProgress))
        }
      })
      results.push(result)
    }

    return results
  }

  const deleteFile = async (fileUrl: string) => {
    try {
      await $api.delete(`/upload/delete?url=${encodeURIComponent(fileUrl)}`)
      
      notifications.success('Suppression réussie', 'Le fichier a été supprimé avec succès')
      return true
    } catch (err: any) {
      notifications.handleApiError(err, 'Erreur lors de la suppression du fichier')
      return false
    }
  }

  // Helper functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isFileTypeAccepted = (file: File, accept: string): boolean => {
    const acceptTypes = accept.split(',').map(type => type.trim())
    
    return acceptTypes.some(acceptType => {
      if (acceptType.startsWith('.')) {
        // Extension check
        return file.name.toLowerCase().endsWith(acceptType.toLowerCase())
      } else if (acceptType.includes('*')) {
        // MIME type wildcard check
        const baseType = acceptType.split('/')[0]
        return file.type.startsWith(baseType)
      } else {
        // Exact MIME type check
        return file.type === acceptType
      }
    })
  }

  const getImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Le fichier n\'est pas une image'))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'))
      reader.readAsDataURL(file)
    })
  }

  const validateImageDimensions = async (file: File, maxWidth?: number, maxHeight?: number): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(false)
        return
      }

      const img = new Image()
      img.onload = () => {
        let valid = true
        
        if (maxWidth && img.width > maxWidth) {
          valid = false
        }
        if (maxHeight && img.height > maxHeight) {
          valid = false
        }
        
        resolve(valid)
      }
      img.onerror = () => resolve(false)
      img.src = URL.createObjectURL(file)
    })
  }

  return {
    uploading: readonly(uploading),
    progress: readonly(progress),
    error: readonly(error),
    uploadFile,
    uploadMultiple,
    deleteFile,
    formatFileSize,
    isFileTypeAccepted,
    getImagePreview,
    validateImageDimensions
  }
}
