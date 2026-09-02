import { FileText, FileType, Image as ImageIcon, File } from 'lucide-react'

/**
 * Visual metadata (icon + color) for a document file type.
 * Centralized so every card/list/detail view stays consistent.
 */
export function getFileMeta(type = '') {
  const t = type.toLowerCase()
  switch (t) {
    case 'pdf':
      return { Icon: FileText, tint: 'text-red-500', bg: 'bg-red-500/10', label: 'PDF' }
    case 'docx':
    case 'doc':
      return { Icon: FileType, tint: 'text-blue-500', bg: 'bg-blue-500/10', label: 'DOCX' }
    case 'txt':
      return { Icon: FileText, tint: 'text-slate-400', bg: 'bg-slate-500/10', label: 'TXT' }
    case 'png':
    case 'jpg':
    case 'jpeg':
      return { Icon: ImageIcon, tint: 'text-emerald-500', bg: 'bg-emerald-500/10', label: t.toUpperCase() }
    default:
      return { Icon: File, tint: 'text-brand-500', bg: 'bg-brand-500/10', label: t.toUpperCase() || 'FILE' }
  }
}
