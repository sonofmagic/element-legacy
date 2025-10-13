export function stripScript(content: string): string {
  const result = content.match(/<(script)(?:\s[^>]*)?>([\s\S]+?)<\/\1>/)
  return result && result[2] ? result[2].trim() : ''
}

export function stripStyle(content: string): string {
  const result = content.match(/<(style)(?:\s[^>]*)?>([\s\S]+?)<\/\1>/)
  return result && result[2] ? result[2].trim() : ''
}

export function stripTemplate(content: string): string {
  const trimmed = content.trim()
  if (!trimmed) {
    return trimmed
  }
  return trimmed.replace(/<(script|style)[\s\S]+<\/\1>/g, '').trim()
}
