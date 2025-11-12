import type { StateStorage } from 'zustand/middleware'

/**
 * IndexedDB storage adapter for zustand persist middleware
 * Provides a StateStorage interface implementation using IndexedDB
 */
export const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('zustand-db', 1)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('store')) {
          db.createObjectStore('store')
        }
      }

      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['store'], 'readonly')
        const store = transaction.objectStore('store')
        const getRequest = store.get(name)

        getRequest.onsuccess = () => {
          const result = getRequest.result
          resolve(result || null)
        }

        getRequest.onerror = () => {
          reject(getRequest.error)
        }
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  },
  setItem: async (name: string, value: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('zustand-db', 1)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('store')) {
          db.createObjectStore('store')
        }
      }

      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['store'], 'readwrite')
        const store = transaction.objectStore('store')
        const putRequest = store.put(value, name)

        putRequest.onsuccess = () => {
          resolve()
        }

        putRequest.onerror = () => {
          reject(putRequest.error)
        }
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  },
  removeItem: async (name: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('zustand-db', 1)

      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['store'], 'readwrite')
        const store = transaction.objectStore('store')
        const deleteRequest = store.delete(name)

        deleteRequest.onsuccess = () => {
          resolve()
        }

        deleteRequest.onerror = () => {
          reject(deleteRequest.error)
        }
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  },
}
