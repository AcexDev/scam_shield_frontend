'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image, X, FileImage } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  onFile: (file: File) => void
  disabled?: boolean
}

export function ImageDropzone({ onFile, disabled }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const onDrop = useCallback((accepted: File[]) => {
    const file = accepted[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    onFile(file)
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
    maxFiles: 1,
    disabled,
  })

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    setPreview(null)
    setFileName(null)
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer min-h-[180px] flex items-center justify-center',
        isDragActive ? 'drop-active border-[#00D4FF]' : 'border-white/15 hover:border-[#00D4FF]/50 hover:bg-white/[0.02]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="relative w-full p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 mx-auto rounded-xl object-contain"
          />
          <button
            onClick={clear}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-red-500/70 transition-colors"
          >
            <X size={14} />
          </button>
          <p className="text-center text-xs opacity-40 mt-2 font-mono truncate">{fileName}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 p-8 text-center pointer-events-none">
          <div className="p-4 rounded-2xl" style={{ background: 'rgba(0,212,255,0.08)' }}>
            {isDragActive
              ? <FileImage size={28} className="text-[#00D4FF]" />
              : <Upload size={28} className="text-[#00D4FF]/60" />}
          </div>
          <div>
            <p className="text-sm font-medium opacity-70">
              {isDragActive ? 'Drop your screenshot here' : 'Drop a screenshot or click to browse'}
            </p>
            <p className="text-xs opacity-30 mt-1">PNG, JPG, WEBP · Max 10 MB</p>
          </div>
        </div>
      )}
    </div>
  )
}
