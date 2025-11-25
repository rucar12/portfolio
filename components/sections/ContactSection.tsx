'use client'

import { Linkedin,Mail, Send } from 'lucide-react'
import Image from 'next/image'
import { type FormEvent,useMemo, useState } from 'react'

import { Section } from '@/components/ui/Section'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { getStrapiImageUrl, type SocialLink } from '@/lib/strapi'

interface ContactSectionProps {
  socialLinks: SocialLink[]
  email?: string
}

export function ContactSection({ socialLinks, email }: ContactSectionProps) {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const resolvedEmail = useMemo(() => {
    if (email) {
      return email
    }
    const mailLink = socialLinks.find(link => link.url?.toLowerCase().startsWith('mailto:'))
    if (mailLink) {
      return mailLink.url.replace(/^mailto:/i, '')
    }

    return ''
  }, [email, socialLinks])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formState.name || !formState.email || !formState.message) {
      setStatus('error')

      return
    }

    if (!resolvedEmail) {
      setStatus('error')

      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          toEmail: resolvedEmail,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      if (data.fallback) {
        window.location.href = data.mailto
      }

      setStatus('success')
      setFormState({ name: '', email: '', message: '' })
    } catch (error) {
      setStatus('error')
    }
  }

  const getDefaultIcon = (name: string) => {
    const lower = name.toLowerCase()
    if (lower.includes('telegram')) {
      return <Send className="w-5 h-5 text-blue-500" />
    }
    if (lower.includes('mail') || lower.includes('email')) {
      return <Mail className="w-5 h-5 text-blue-500" />
    }
    
return <Linkedin className="w-5 h-5 text-blue-500" />
  }

  if (socialLinks.length === 0) {
    return (
      <Section id="contact" bgColor="white">
        <SectionTitle>Let&apos;s work together</SectionTitle>
        <div className="max-w-3xl mx-auto text-center text-gray-600 dark:text-gray-300">
          Contact information will appear here as soon as you add it in Strapi.
        </div>
      </Section>
    )
  }

  return (
    <Section id="contact" bgColor="white">
      <SectionTitle>Let&apos;s work together</SectionTitle>
      <div className="flex flex-col lg:flex-row gap-10 max-w-5xl mx-auto items-center lg:items-center">
        <div className="space-y-6 flex flex-col w-full lg:flex-1">
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Have an idea, vacancy, or collaboration in mind? Feel free to reach out via the form or
            any social network below.
          </p>
          <div className="space-y-4 flex-1 w-full">
            {socialLinks.map((link, index) => {
              const iconUrl = link.icon ? getStrapiImageUrl(link.icon) : null
              
return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 transition-transform duration-300 group-hover:scale-110">
                    {iconUrl ? (
                      <Image
                        src={iconUrl}
                        alt={link.name}
                        width={32}
                        height={32}
                        className="object-contain rounded-lg"
                      />
                    ) : (
                      getDefaultIcon(link.name)
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{link.name}</p>
                    {link.handle && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{link.handle}</p>
                    )}
                  </div>
                </a>
              )
            })}
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg animate-fade-in-up flex flex-col w-full lg:flex-1 lg:h-auto">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex-shrink-0">
            Send me a message
          </h3>
          <form className="flex flex-col flex-1 min-h-0" onSubmit={handleSubmit}>
            <div className="flex flex-col flex-1 min-h-0 space-y-4">
              <div className="flex-shrink-0">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={event => setFormState(prev => ({ ...prev, name: event.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
              <div className="flex-shrink-0">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={event => setFormState(prev => ({ ...prev, email: event.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formState.message}
                  onChange={event =>
                    setFormState(prev => ({ ...prev, message: event.target.value }))
                  }
                  className="mt-1 block w-full flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-2 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  placeholder="How can I help you?"
                />
              </div>
            </div>
            <div className="mt-4 flex-shrink-0">
              <button
                type="submit"
                disabled={!resolvedEmail || status === 'loading'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className={`w-5 h-5 ${status === 'loading' ? 'animate-spin' : ''}`} />
                {status === 'loading' ? 'Sending...' : 'Send message'}
              </button>
              {status === 'success' && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  Thanks! Your message has been sent successfully.
                </p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                  {resolvedEmail
                    ? 'Failed to send message. Please try again or fill in all fields.'
                    : 'Please add a contact email in Strapi to enable the form.'}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </Section>
  )
}
