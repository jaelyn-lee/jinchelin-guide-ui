import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'

type Mode = 'login' | 'register'

const loginSchema = z
  .object({
    mode: z.enum(['login', 'register']),
    email: z.email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    displayName: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.mode === 'register' && !values.displayName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['displayName'],
        message: 'Name is required',
      })
    }
  })

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mode: 'login',
      email: '',
      password: '',
      displayName: '',
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = form

  const mode = watch('mode') as Mode

  const onSubmit = async ({
    email,
    password,
    displayName,
    mode,
  }: LoginFormValues) => {
    clearErrors('root')
    setSuccessMessage(null)

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName.trim() } },
        })
        if (error) throw error

        form.reset({
          mode: 'login',
          email,
          password: '',
          displayName: '',
        })
        setSuccessMessage(
          'Woohoo! Now you have successfully created account with us',
        )
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        navigate('/', { replace: true })
      }
    } catch (err) {
      form.setError('root', {
        message: err instanceof Error ? err.message : 'Something went wrong',
      })
    }
  }

  return (
    <div className="h-full bg-jin-ink flex flex-col overflow-y-auto overscroll-y-contain scroll-hide">
      <div className="h-1 w-full bg-linear-to-r from-jin-red-deep via-jin-red to-jin-gold" />

      {/* Header */}
      <div className="px-8 pt-14 pb-10 flex flex-col items-center text-center">
        <p className="text-[9px] tracking-[0.35em] uppercase text-jin-gold mb-4 flex items-center gap-3">
          <span className="block w-6 h-px bg-jin-gold/60" />
          Private Access
          <span className="block w-6 h-px bg-jin-gold/60" />
        </p>
        <h1 className="font-display text-5xl font-light text-jin-cream leading-none tracking-tight">
          The Jinchelin
          <br />
          <em className="text-jin-red italic">Guide</em>
        </h1>
        <p className="text-[11px] text-jin-muted mt-4 font-light tracking-wide">
          A private record of every dish he's ever made for you.
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 px-8 mb-8">
        <span className="flex-1 h-px bg-jin-muted/20" />
        <span className="text-jin-gold/40 text-xs">✦</span>
        <span className="flex-1 h-px bg-jin-muted/20" />
      </div>

      {/* Card */}
      <div className="flex-1 px-6">
        {successMessage && (
          <div className="mb-4 rounded-2xl border border-jin-gold/30 bg-jin-gold/10 px-4 py-3 shadow-lg">
            <p className="text-xs text-jin-cream">{successMessage}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-jin-ink-2 border border-jin-muted/20 rounded-2xl p-7 shadow-2xl"
        >
          {/* Mode toggle */}
          <div className="flex mb-8 bg-jin-ink rounded-xl p-1">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => {
                  setValue('mode', m, { shouldValidate: true })
                  clearErrors()
                  setSuccessMessage(null)
                }}
                className={`flex-1 py-2 rounded-lg text-xs tracking-widest uppercase transition-all duration-200 ${
                  mode === m
                    ? 'bg-jin-red text-jin-cream font-medium'
                    : 'text-jin-muted hover:text-jin-cream'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {mode === 'register' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] tracking-[0.2em] uppercase text-jin-muted">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="bg-jin-ink border border-jin-muted/30 rounded-xl px-4 py-3 text-sm text-jin-cream placeholder:text-jin-muted/40 focus:outline-none focus:border-jin-red/60 transition-colors"
                  {...register('displayName')}
                />
                {errors.displayName?.message && (
                  <p className="text-jin-blush text-xs">
                    {String(errors.displayName.message)}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-[0.2em] uppercase text-jin-muted">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-jin-ink border border-jin-muted/30 rounded-xl px-4 py-3 text-sm text-jin-cream placeholder:text-jin-muted/40 focus:outline-none focus:border-jin-red/60 transition-colors"
                {...register('email')}
              />
              {errors.email?.message && (
                <p className="text-jin-blush text-xs">
                  {String(errors.email.message)}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-[0.2em] uppercase text-jin-muted">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="bg-jin-ink border border-jin-muted/30 rounded-xl px-4 py-3 text-sm text-jin-cream placeholder:text-jin-muted/40 focus:outline-none focus:border-jin-red/60 transition-colors"
                {...register('password')}
              />
              {errors.password?.message && (
                <p className="text-jin-blush text-xs">
                  {String(errors.password.message)}
                </p>
              )}
            </div>

            {errors.root?.message && (
              <div className="bg-jin-red/10 border border-jin-red/30 rounded-xl px-4 py-3">
                <p className="text-jin-blush text-xs">{errors.root.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-jin-red hover:bg-jin-red-vivid active:bg-jin-red-deep disabled:opacity-50 text-jin-cream rounded-xl py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-200"
            >
              {isSubmitting
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Enter the Guide'
                  : 'Create Account'}
            </button>
          </div>
        </form>

        {/* Bottom decoration */}
        <div className="flex items-center justify-center gap-3 mt-8 pb-10">
          <span className="w-8 h-px bg-jin-muted/20" />
          <span className="text-[9px] tracking-[0.25em] uppercase text-jin-muted/40">
            By invite only
          </span>
          <span className="w-8 h-px bg-jin-muted/20" />
        </div>
      </div>
    </div>
  )
}
