import { useEffect, useRef, useState, useCallback } from 'react'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const PARAKOU_CENTER = { lat: 9.3371, lng: 2.6303 }

// Chargement unique du script Google Maps (partagé entre toutes les instances)
let mapsPromise = null
export function loadGoogleMaps() {
  if (window.google?.maps) return Promise.resolve(window.google.maps)
  if (mapsPromise) return mapsPromise

  mapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&language=fr&region=BJ`
    script.async = true
    script.onload = () => resolve(window.google.maps)
    script.onerror = () => { mapsPromise = null; reject(new Error('Google Maps n\'a pas pu être chargé.')) }
    document.head.appendChild(script)
  })
  return mapsPromise
}

/** Géocodage inverse Google : coordonnées → quartier/ville. */
export async function googleReverseGeocode(lat, lng) {
  const maps = await loadGoogleMaps()
  const geocoder = new maps.Geocoder()
  return new Promise((resolve) => {
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status !== 'OK' || !results?.length) return resolve(null)
      const components = results[0].address_components || []
      const get = (type) => components.find(c => c.types.includes(type))?.long_name
      resolve({
        neighborhood: get('sublocality_level_1') || get('sublocality') || get('neighborhood') || get('locality') || null,
        city: get('locality') || get('administrative_area_level_2') || null,
        formatted: results[0].formatted_address,
      })
    })
  })
}

/** Ouvre l'itinéraire Google Maps vers une destination (pour le livreur). */
export function openDirections(destination) {
  // destination : "lat,lng" ou texte d'adresse
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`
  window.open(url, '_blank', 'noopener')
}

/**
 * Carte interactive Google Maps avec marqueur déplaçable.
 *
 * Props :
 *  - position  : { lat, lng } | null — position du marqueur
 *  - onSelect  : ({ lat, lng }) => void — appelé au clic ou drag du marqueur
 *  - height    : hauteur CSS (défaut '240px')
 *  - readOnly  : true = marqueur fixe, pas de clic (affichage pour livreur)
 */
export default function GoogleMapPicker({ position, onSelect, height = '240px', readOnly = false }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const onSelectRef = useRef(onSelect)
  const [error, setError] = useState(false)

  onSelectRef.current = onSelect

  // Init carte
  useEffect(() => {
    let cancelled = false

    loadGoogleMaps()
      .then(maps => {
        if (cancelled || !containerRef.current || mapRef.current) return

        const map = new maps.Map(containerRef.current, {
          center: position ?? PARAKOU_CENTER,
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          gestureHandling: 'greedy',
        })
        mapRef.current = map

        const marker = new maps.Marker({
          map,
          position: position ?? PARAKOU_CENTER,
          draggable: !readOnly,
        })
        markerRef.current = marker

        if (!readOnly) {
          map.addListener('click', (e) => {
            const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() }
            marker.setPosition(pos)
            onSelectRef.current?.(pos)
          })
          marker.addListener('dragend', () => {
            const p = marker.getPosition()
            onSelectRef.current?.({ lat: p.lat(), lng: p.lng() })
          })
        }
      })
      .catch(() => { if (!cancelled) setError(true) })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Synchroniser la position externe (ex : bouton "Ma position")
  useEffect(() => {
    if (!position || !mapRef.current || !markerRef.current) return
    markerRef.current.setPosition(position)
    mapRef.current.panTo(position)
  }, [position?.lat, position?.lng]) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center rounded-2xl border border-ink-200 bg-ink-50 text-sm text-ink-400"
      >
        Carte indisponible — vérifiez votre connexion.
      </div>
    )
  }

  return <div ref={containerRef} style={{ height, width: '100%' }} className="rounded-2xl" />
}
