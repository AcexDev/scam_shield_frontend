'use client'
import { useCallback, useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Mic, Square, X, FileAudio, Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  onFile: (file: File) => void
  disabled?: boolean
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function AudioDropzone({ onFile, disabled }: Props) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordTime, setRecordTime] = useState(0)
  const [micError, setMicError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const onDrop = useCallback((accepted: File[]) => {
    const file = accepted[0]
    if (!file) return
    setFileName(file.name)
    setAudioUrl(URL.createObjectURL(file))
    onFile(file)
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.webm', '.aac'] },
    maxFiles: 1,
    disabled: disabled || isRecording,
  })

  function clear(e?: React.MouseEvent) {
    e?.stopPropagation()
    setFileName(null)
    setAudioUrl(null)
    setIsPlaying(false)
  }

  async function startRecording(e: React.MouseEvent) {
    e.stopPropagation()
    setMicError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = ev => chunksRef.current.push(ev.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' })
        setFileName(file.name)
        setAudioUrl(URL.createObjectURL(blob))
        onFile(file)
        stream.getTracks().forEach(t => t.stop())
      }

      recorder.start()
      setIsRecording(true)
      setRecordTime(0)
      timerRef.current = setInterval(() => setRecordTime(t => t + 1), 1000)
    } catch {
      setMicError('Microphone access denied. You can still upload an audio file.')
    }
  }

  function stopRecording(e: React.MouseEvent) {
    e.stopPropagation()
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  function togglePlay(e: React.MouseEvent) {
    e.stopPropagation()
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()
    setIsPlaying(!isPlaying)
  }

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
  }, [])

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative rounded-2xl border-2 border-dashed transition-all duration-200 min-h-[180px] flex items-center justify-center',
        !audioUrl && !isRecording && 'cursor-pointer',
        isDragActive ? 'drop-active border-[#00D4FF]' : 'border-white/15 hover:border-[#00D4FF]/50 hover:bg-white/[0.02]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />

      {audioUrl ? (
        <div className="w-full p-6 flex flex-col items-center gap-3">
          <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #00D4FF, #7C3AED)' }}
          >
            {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-0.5" />}
          </button>
          <p className="text-xs font-mono opacity-50 truncate max-w-[200px]">{fileName}</p>
          <button
            onClick={clear}
            className="flex items-center gap-1 text-xs opacity-40 hover:opacity-70 hover:text-red-400 transition-all"
          >
            <X size={12} /> Remove
          </button>
        </div>
      ) : isRecording ? (
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-red-500/30 animate-pulse-ring" />
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500/20 border-2 border-red-500">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            </div>
          </div>
          <p className="text-sm font-mono" style={{ color: '#EF4444' }}>{formatTime(recordTime)}</p>
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            <Square size={12} /> Stop Recording
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <div className="p-4 rounded-2xl pointer-events-none" style={{ background: 'rgba(0,212,255,0.08)' }}>
            {isDragActive
              ? <FileAudio size={28} className="text-[#00D4FF]" />
              : <Upload size={28} className="text-[#00D4FF]/60" />}
          </div>
          <div className="pointer-events-none">
            <p className="text-sm font-medium opacity-70">
              {isDragActive ? 'Drop your audio file here' : 'Drop a voice note or click to browse'}
            </p>
            <p className="text-xs opacity-30 mt-1">MP3, WAV, M4A, OGG · Max 25 MB</p>
          </div>

          <div className="flex items-center gap-2 my-1 pointer-events-none">
            <span className="w-8 h-px bg-white/10" />
            <span className="text-[10px] opacity-30">OR</span>
            <span className="w-8 h-px bg-white/10" />
          </div>

          <button
            onClick={startRecording}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all hover:scale-[1.03]"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              borderColor: 'rgba(0,212,255,0.3)',
              background: 'rgba(0,212,255,0.06)',
              color: '#00D4FF',
            }}
          >
            <Mic size={13} /> Record a Voice Note
          </button>

          {micError && <p className="text-[11px] text-red-400 mt-1">{micError}</p>}
        </div>
      )}
    </div>
  )
}
