import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'
import { useGetCategoriesQuery } from '@/api/categories-api'
import { useCreateDishMutation } from '@/api/dishes-api'
import { useCreateReviewMutation } from '@/api/reviews-api'
import { useUploadPhotoMutation } from '@/api/upload-api'
import TabBar from '@/components/TabBar'

export default function AddReviewPage() {
  const navigate = useNavigate()

  const [dishName, setDishName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [rating, setRating] = useState(8.0)
  const [reviewText, setReviewText] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const { data: categories } = useGetCategoriesQuery()
  const [createDish] = useCreateDishMutation()
  const [createReview] = useCreateReviewMutation()
  const [uploadPhoto] = useUploadPhotoMutation()

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
        ? (() => {
            const formData = new FormData()
            formData.append('file', photoFile)
            return uploadPhoto(formData).unwrap().then((res) => res.url)
          })()
        : Promise.resolve(null)

      const [, dish] = await Promise.all([
        uploadPromise,
        createDish({
          name: dishName.trim(),
          categoryId,
        }).unwrap(),
      ])

      // Create review only after both photo URL and dish ID are available
      const normalizedRating = Math.max(
        0,
        Math.min(10, Number(rating.toFixed(1))),
      )

      await createReview({
        dishId: dish.id,
        rating: normalizedRating,
        comment: reviewText || undefined,
      }).unwrap()

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
      <div className="px-6 pt-14 pb-5 border-b border-white/10 shrink-0">
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
            {categories && categories.map((c) => (
              <option key={c.id} value={c.id ?? ''}>
                {c.name} · {c.cuisine}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="section-label block mb-3">Rating</label>
          <div className="rounded-2xl border border-white/10 bg-jin-ink-2 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-jin-muted">0.0</span>
              <span className="font-display text-lg text-jin-gold">
                {rating.toFixed(1)}
                <span className="text-[11px] text-jin-muted ml-1">/ 10</span>
              </span>
              <span className="text-xs text-jin-muted">10.0</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full accent-jin-red-vivid"
            />
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
