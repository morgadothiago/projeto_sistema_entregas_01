import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { X } from "lucide-react"

interface DialogModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children?: React.ReactNode
  submitLabel?: string
  onSubmit?: () => void
  showSubmit?: boolean
  disableSubmit?: boolean
  maxWidth?: string
}

export default function DialogModal({
  open,
  onOpenChange,
  title = "Modal",
  description,
  children,
  submitLabel = "Salvar",
  onSubmit,
  showSubmit = true,
  disableSubmit = false,
  maxWidth = "sm:max-w-md",
}: DialogModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidth} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {title}
            </DialogTitle>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-7 w-7 p-0 hover:bg-gray-100"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {description && (
            <DialogDescription className="text-xs text-gray-500">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="py-1">{children}</div>

        {showSubmit && (
          <Button
            onClick={onSubmit}
            disabled={disableSubmit}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
          >
            {submitLabel}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
