// src/components/ui/upload.tsx
import * as React from "react";
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const uploadVariants = cva(
  "flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-background text-muted-foreground px-4 py-8 w-full",
  {
    variants: {
      state: {
        idle: "",
        active: "border-blue-500 bg-blue-50 text-blue-700",
        accept: "border-green-500 bg-green-50 text-green-700",
        reject: "border-red-500 bg-red-50 text-red-700",
      },
      size: {
        default: "min-h-[120px]",
        sm: "min-h-[80px] py-4",
        lg: "min-h-[180px] py-12",
      },
    },
    defaultVariants: {
      state: "idle",
      size: "default",
    },
  }
);

export interface UploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop">,
    VariantProps<typeof uploadVariants> {
  accept?: DropzoneOptions["accept"];
  maxSize?: DropzoneOptions["maxSize"];
  multiple?: boolean;
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[]) => void;
  onFileSelect?: (files: File[]) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  "aria-label"?: string;
}

const Upload = React.forwardRef<HTMLDivElement, UploadProps>(
  (
    {
      className,
      accept,
      maxSize,
      multiple = true,
      onDrop,
      onFileSelect,
      disabled,
      size,
      children,
      "aria-label": ariaLabel = "ファイルアップロード",
      ...props
    },
    ref
  ) => {
    const [isDragActive, setIsDragActive] = React.useState(false);
    const [isDragReject, setIsDragReject] = React.useState(false);
    const [isDragAccept, setIsDragAccept] = React.useState(false);

    const handleDrop = React.useCallback(
      (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        onDrop?.(acceptedFiles, fileRejections);
        if (acceptedFiles.length > 0) {
          onFileSelect?.(acceptedFiles);
        }
      },
      [onDrop, onFileSelect]
    );

    const {
      getRootProps,
      getInputProps,
      isDragActive: dropzoneActive,
      isDragReject: dropzoneReject,
      isDragAccept: dropzoneAccept,
      open,
      inputRef,
    } = useDropzone({
      accept,
      maxSize,
      multiple,
      disabled,
      onDrop: handleDrop,
      noClick: false,
      noKeyboard: false,
      onDragEnter: () => {
        setIsDragActive(true);
        setIsDragReject(false);
        setIsDragAccept(false);
      },
      onDragLeave: () => {
        setIsDragActive(false);
        setIsDragReject(false);
        setIsDragAccept(false);
      },
      onDropAccepted: () => {
        setIsDragActive(false);
        setIsDragAccept(true);
        setIsDragReject(false);
      },
      onDropRejected: () => {
        setIsDragActive(false);
        setIsDragAccept(false);
        setIsDragReject(true);
      },
    });

    let state: VariantProps<typeof uploadVariants>["state"] = "idle";
    if (isDragReject || dropzoneReject) state = "reject";
    else if (isDragAccept || dropzoneAccept) state = "accept";
    else if (isDragActive || dropzoneActive) state = "active";

    return (
      <div
        {...getRootProps({
          tabIndex: 0,
          role: "button",
          "aria-label": ariaLabel,
          "aria-disabled": disabled,
          className: cn(uploadVariants({ state, size, className })),
          ref,
          ...props,
        })}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            open();
          }
        }}
      >
        <input {...getInputProps()} />
        {children ? (
          children
        ) : (
          <span>
            ドラッグ＆ドロップ、またはクリックしてファイルを選択
            <br />
            <span className="text-xs text-muted-foreground">
              {accept
                ? `対応形式: ${typeof accept === "string" ? accept : Object.keys(accept).join(", ")}`
                : ""}
              {maxSize ? `　最大サイズ: ${(maxSize / 1024 / 1024).toFixed(1)}MB` : ""}
            </span>
          </span>
        )}
      </div>
    );
  }
);
Upload.displayName = "Upload";

export { Upload };