'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface QrCodeScannerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onScanned: (value: string) => void
}

type BarcodeDetectorConstructor = new (options: {
  formats: string[]
}) => {
  detect: (source: unknown) => Promise<Array<{ rawValue?: string }>>
}

function getBarcodeDetectorConstructor():
  | BarcodeDetectorConstructor
  | undefined {
  return (globalThis as unknown as { BarcodeDetector?: BarcodeDetectorConstructor })
    .BarcodeDetector
}

export function QrCodeScannerDialog({
  open,
  onOpenChange,
  onScanned,
}: QrCodeScannerDialogProps): React.JSX.Element {
  const { t } = useTranslation()
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const intervalRef = React.useRef<number | null>(null)

  const [status, setStatus] = React.useState<
    'idle' | 'starting' | 'scanning' | 'unsupported' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const stop = React.useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop()
      }
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const start = React.useCallback(async () => {
    setStatus('starting')
    setErrorMessage(null)

    const BarcodeDetectorCtor = getBarcodeDetectorConstructor()
    if (!BarcodeDetectorCtor) {
      setStatus('unsupported')
      setErrorMessage(
        t('form.qrNotSupported') ||
          'QR scanning is not supported in this browser.',
      )
      return
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error')
      setErrorMessage(
        t('form.qrNoCamera') || 'Camera access is not available.',
      )
      return
    }

    try {
      const detector = new BarcodeDetectorCtor({ formats: ['qr_code'] })
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })

      streamRef.current = stream

      if (!videoRef.current) {
        setStatus('error')
        setErrorMessage(t('form.qrError') || 'Failed to start scanner.')
        stop()
        return
      }

      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setStatus('scanning')

      intervalRef.current = window.setInterval(async () => {
        const video = videoRef.current
        if (!video || video.readyState < 2) return

        try {
          const results = await detector.detect(video)
          const value = results[0]?.rawValue
          if (typeof value === 'string' && value.length > 0) {
            stop()
            onScanned(value)
            onOpenChange(false)
          }
        } catch {
          // ignore detection errors and keep scanning
        }
      }, 250)
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        t('form.qrPermissionDenied') ||
          'Camera permission was denied or unavailable.',
      )
      console.error('QR scanner error:', error)
      stop()
    }
  }, [onOpenChange, onScanned, stop, t])

  React.useEffect(() => {
    if (!open) {
      setStatus('idle')
      setErrorMessage(null)
      stop()
      return
    }

    void start()

    return () => {
      stop()
    }
  }, [open, start, stop])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{t('form.qrScannerTitle')}</DialogTitle>
          <DialogDescription>
            {t('form.qrScannerDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="bg-muted aspect-video overflow-hidden rounded-md border">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              muted
              playsInline
            />
          </div>

          {status === 'starting' && (
            <p className="text-muted-foreground text-sm">
              {t('form.qrStarting') || 'Starting camera...'}
            </p>
          )}

          {status === 'scanning' && (
            <p className="text-muted-foreground text-sm">
              {t('form.qrScanning') || 'Point the camera at a QR code.'}
            </p>
          )}

          {(status === 'unsupported' || status === 'error') && (
            <p className="text-destructive text-sm">
              {errorMessage ??
                (t('form.qrError') || 'Failed to start scanner.')}
            </p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t('form.cancel')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

