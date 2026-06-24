import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

/**
 * Detects whether a content string is legacy HTML or Markdown.
 * Returns true if the string likely contains HTML markup.
 */
function isHtmlContent(content: string): boolean {
  const trimmed = content.trim()
  // Check if content starts with an HTML tag or contains common block-level HTML elements
  return (
    trimmed.startsWith('<') ||
    /<(?:div|section|p|h[1-6]|ul|ol|article|blockquote|table)\b/i.test(trimmed)
  )
}

export default function ArticleContent({ content }: { content: string }) {
  // Fallback: render legacy HTML posts with dangerouslySetInnerHTML
  if (isHtmlContent(content)) {
    return (
      <div
        className="article-content max-w-[680px]"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // New Markdown posts: render with react-markdown + prose styling
  return (
    <div className="article-content prose prose-blue prose-slate max-w-[680px]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
