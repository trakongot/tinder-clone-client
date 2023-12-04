import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'

export const SafeHTMLDisplay = ({ htmlContent }: { htmlContent: string }) => {
  const [sanitizedContent, setSanitizedContent] = useState('')

  useEffect(() => {
    const sanitizedHTML = DOMPurify.sanitize(htmlContent)
    setSanitizedContent(sanitizedHTML)
  }, [htmlContent])

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
}
