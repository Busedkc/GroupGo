import { Fragment } from 'react'

type Block =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--text-h)' }}>{part.slice(2, -2)}</strong>
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

function parseBlocks(raw: string): Block[] {
  const cleaned = raw
    .replace(/\r\n/g, '\n')
    .replace(/[\u0600-\u06FF\u0750-\u077F]/g, '')
    .trim()

  const lines = cleaned.split('\n')
  const blocks: Block[] = []
  let currentList: string[] | null = null
  let paragraphBuf: string[] = []

  const flushParagraph = () => {
    if (paragraphBuf.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraphBuf.join(' ') })
      paragraphBuf = []
    }
  }
  const flushList = () => {
    if (currentList && currentList.length > 0) {
      blocks.push({ type: 'list', items: currentList })
    }
    currentList = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (line === '') {
      flushParagraph()
      flushList()
      continue
    }

    const numberedHeading = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*:?\s*(.*)$/)
    if (numberedHeading) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'heading', text: numberedHeading[2] })
      if (numberedHeading[3]) {
        paragraphBuf.push(numberedHeading[3])
      }
      continue
    }

    const bulletMatch = line.match(/^[*\-•]\s+(.*)$/)
    if (bulletMatch) {
      flushParagraph()
      if (!currentList) currentList = []
      currentList.push(bulletMatch[1])
      continue
    }

    flushList()
    paragraphBuf.push(line)
  }
  flushParagraph()
  flushList()

  return blocks
}

export default function AIResponse({ text }: { text: string }) {
  const blocks = parseBlocks(text)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', lineHeight: 1.65 }}>
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          return (
            <h4
              key={i}
              style={{
                color: 'var(--text-h)',
                fontSize: '1.05rem',
                fontWeight: 700,
                margin: 0,
                marginTop: i === 0 ? 0 : '0.25rem'
              }}
            >
              {renderInline(block.text)}
            </h4>
          )
        }
        if (block.type === 'list') {
          return (
            <ul
              key={i}
              style={{
                margin: 0,
                paddingLeft: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                listStyle: 'none'
              }}
            >
              {block.items.map((item, j) => (
                <li
                  key={j}
                  style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      marginTop: '0.55rem',
                      flexShrink: 0
                    }}
                  />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} style={{ color: 'var(--text)' }}>
            {renderInline(block.text)}
          </p>
        )
      })}
    </div>
  )
}
