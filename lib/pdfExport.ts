'use client'

export async function downloadCV(cvFileUrl: string, filename?: string) {
  try {
    const response = await fetch(cvFileUrl)
    if (!response.ok) {
      throw new Error('Failed to download CV')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || 'CV.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading CV:', error)
    alert('Error downloading CV. Please try again.')
  }
}
