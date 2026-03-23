import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'
import {
  categoriesClient,
  dishesClient,
  reviewsClient,
  uploadClient,
} from '../services/clients'
import type { CategoryResponse } from '../services/apiClient'
import TabBar from '../components/TabBar'

export default function AddReviewPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState<CategoryResponse[]>([])
  console.log('categories', categories)
  const [dishName, setDishName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [rating, setRating] = useState(4)
  const [reviewText, setReviewText] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    categoriesClient.getAll().then(setCategories)
    console.log('set categories done')
  }, [])

  const handlePhotoTap = async () => {
    if (!Capacitor.isNativePlatform()) {
      fileRef.current?.click()
      return
    }
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        quality: 80,
      })
      if (photo.dataUrl) {
        setPhotoPreview(photo.dataUrl)
        const res = await fetch(photo.dataUrl)
        const blob = await res.blob()
        setPhotoFile(new File([blob], 'photo.jpg', { type: 'image/jpeg' }))
      }
    } catch (error) {
      console.log('Camera error or cancelled:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!dishName.trim()) return alert('Please enter a dish name.')
    if (!categoryId) return alert('Please select a category.')

    setSubmitting(true)
    try {
      // Upload photo and create dish in parallel — both are independent
      const uploadPromise = photoFile
        ? uploadClient
            .uploadPhoto({ data: photoFile, fileName: photoFile.name })
            .then((res) => (res as unknown as { url: string }).url)
        : Promise.resolve(null)

      const [photoUrl, dish] = await Promise.all([
        uploadPromise,
        dishesClient.create({
          name: dishName.trim(),
          categoryId: categoryId || undefined,
        }),
      ])

      // Create review only after both photo URL and dish ID are available
      await reviewsClient.create({
        dishId: dish.id,
        rating,
        reviewText: reviewText || undefined,
        photoUrl: photoUrl || undefined,
      })

      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container relative">
      <div className="px-6 pt-14 pb-5 border-b border-white/10 flex-shrink-0">
        <h1 className="font-display text-4xl font-light text-jin-cream">
          New <em className="text-jin-red-vivid">Review</em>
        </h1>
        <p className="text-xs text-jin-muted mt-1">
          Tell us what he made this time.
        </p>
      </div>

      <div className="scroll-area px-4 pt-5 space-y-5">
        <button
          onClick={handlePhotoTap}
          className="w-full h-44 border border-dashed border-jin-red/40 rounded-2xl
                     flex flex-col items-center justify-center gap-3
                     bg-jin-red/5 cursor-pointer active:bg-jin-red/10 transition-colors overflow-hidden"
        >
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl border border-jin-red/30 flex items-center justify-center">
                <svg
                  className="w-5 h-5 stroke-jin-red-vivid"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                >
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <p className="text-xs text-jin-muted">Add a photo</p>
              <p className="text-[11px] text-jin-red-vivid">
                Take one now or choose from gallery
              </p>
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div>
          <label className="section-label block mb-2">Dish name</label>
          <input
            className="field-input"
            placeholder="e.g. Spaghetti alla Carbonara"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
          />
        </div>

        <div>
          <label className="section-label block mb-2">Category</label>
          <select
            className="field-input appearance-none cursor-pointer"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select a category...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id ?? ''}>
                {c.name} · {c.cuisine}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="section-label block mb-3">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={`text-2xl transition-opacity ${n <= rating ? 'opacity-100' : 'opacity-20'}`}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="section-label block mb-2">Your review</label>
          <textarea
            className="field-input resize-none leading-relaxed"
            rows={4}
            placeholder="Be honest. Brutally, lovingly honest."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>

        <div className="h-4" />
      </div>

      <TabBar />
    </div>
  )
}
