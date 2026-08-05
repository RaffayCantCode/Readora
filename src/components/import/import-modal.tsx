"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { DuplicateAction, ImportedBook, ImportQueueItem, SupportedFormat } from "@/lib/import/import-types";
import { importStore } from "@/lib/import/import-store";

export function ImportModal({
  isOpen,
  onClose,
  targetBookTitle,
  onImportSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  targetBookTitle?: string; // Optional target validation for page-specific book import
  onImportSuccess?: (book: ImportedBook) => void;
}) {
  const [queue, setQueue] = useState<ImportQueueItem[]>([]);
  const [activeDuplicate, setActiveDuplicate] = useState<ImportQueueItem | null>(null);
  const [importedHistory, setImportedHistory] = useState<ImportedBook[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImportedHistory(importStore.getImportedBooks());
    const unsubscribe = importStore.subscribe(() => {
      setImportedHistory(importStore.getImportedBooks());
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const queueId = `queue-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const ext = file.name.split(".").pop()?.toLowerCase();
      const validFormat: SupportedFormat = (["pdf", "epub", "mobi", "azw3", "docx", "txt", "md", "cbz", "cbr"].includes(ext ?? "") ? ext : "pdf") as SupportedFormat;

      const newItem: ImportQueueItem = {
        id: queueId,
        file,
        fileName: file.name,
        fileSize: file.size,
        fileFormat: validFormat,
        progress: 10,
        status: "extracting",
      };

      setQueue((prev) => [newItem, ...prev]);

      try {
        const { item, duplicateMatch } = await importStore.processFile(file, (p) => {
          setQueue((prev) => prev.map((i) => (i.id === queueId ? { ...i, progress: p } : i)));
        });

        // Target book title validation check for page-specific import
        if (targetBookTitle && item.extractedMetadata?.title) {
          const matchScore = item.extractedMetadata.title.toLowerCase().includes(targetBookTitle.toLowerCase()) ||
            targetBookTitle.toLowerCase().includes(item.extractedMetadata.title.toLowerCase());
          if (!matchScore) {
            setQueue((prev) => prev.map((i) => (i.id === queueId ? { ...i, status: "error", error: `File name does not match open book "${targetBookTitle}".` } : i)));
            continue;
          }
        }

        if (duplicateMatch) {
          const dupeItem = { ...item, id: queueId };
          setQueue((prev) => prev.map((i) => (i.id === queueId ? dupeItem : i)));
          setActiveDuplicate(dupeItem);
        } else {
          setQueue((prev) => prev.map((i) => (i.id === queueId ? { ...i, status: "ready", progress: 100 } : i)));
          if (item.finalBook && onImportSuccess) {
            onImportSuccess(item.finalBook);
          }
        }
      } catch (err) {
        setQueue((prev) =>
          prev.map((i) =>
            i.id === queueId
              ? { ...i, status: "error", error: (err as Error).message || "Failed to process file." }
              : i
          )
        );
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleResolveDuplicate = (action: DuplicateAction) => {
    if (!activeDuplicate) return;

    const resultBook = importStore.resolveDuplicate(activeDuplicate, action);
    setQueue((prev) =>
      prev.map((i) => (i.id === activeDuplicate.id ? { ...i, status: action === "skip" ? "error" : "ready", progress: 100, error: action === "skip" ? "Skipped duplicate" : undefined } : i))
    );

    if (resultBook && onImportSuccess) {
      onImportSuccess(resultBook);
    }
    setActiveDuplicate(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border shadow-2xl flex flex-col max-h-[90vh]"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-strong)",
          color: "var(--text-main)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm" style={{ borderColor: "var(--border-subtle)", color: "var(--accent-brass)", backgroundColor: "var(--bg-desk)" }}>
              <UploadCloud size={20} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">
                {targetBookTitle ? `Import Edition for &quot;${targetBookTitle}&quot;` : "Book Import Engine"}
              </h2>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                Drag & drop PDF, EPUB, MOBI, AZW3, DOCX, TXT, MD, CBZ, CBR files
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl border p-2 hover:opacity-100 opacity-60 transition" style={{ borderColor: "var(--border-subtle)" }}>
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition cursor-pointer ${
              dragActive ? "scale-[1.01]" : "hover:border-brass"
            }`}
            style={{
              borderColor: dragActive ? "var(--accent-brass)" : "var(--border-subtle)",
              backgroundColor: dragActive ? "var(--accent-glow)" : "var(--bg-desk)",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.epub,.mobi,.azw3,.docx,.txt,.md,.cbz,.cbr"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />

            <UploadCloud size={40} className="mb-3 text-brass animate-bounce" />
            <h3 className="font-display text-lg font-bold">Drop your book files here</h3>
            <p className="mt-1 text-xs max-w-md" style={{ color: "var(--text-dim)" }}>
              Supports PDF, EPUB, MOBI, AZW3, DOCX, TXT, Markdown, CBZ, CBR. Automatic metadata extraction and cover generation enabled.
            </p>
            <span className="mt-4 rounded-xl border px-4 py-2 text-xs font-bold shadow-sm" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-surface)" }}>
              Browse Files
            </span>
          </div>

          {/* Upload Queue Section */}
          {queue.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent-brass)" }}>
                Upload Queue ({queue.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border p-3 text-xs"
                    style={{ backgroundColor: "var(--bg-desk)", borderColor: "var(--border-subtle)" }}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
                      <FileText size={18} className="text-brass shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate font-bold">{item.fileName}</p>
                          <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 rounded border" style={{ borderColor: "var(--border-subtle)", color: "var(--accent-brass)" }}>
                            {item.fileFormat}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-1.5 h-1.5 w-full rounded-full bg-black/20 overflow-hidden">
                          <div className="h-full bg-brass transition-all duration-300" style={{ width: `${item.progress}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {item.status === "ready" && (
                        <span className="flex items-center gap-1 text-emerald-500 font-bold text-[11px]">
                          <CheckCircle2 size={14} /> Ready
                        </span>
                      )}
                      {item.status === "duplicate_found" && (
                        <span className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                          <AlertCircle size={14} /> Duplicate
                        </span>
                      )}
                      {item.status === "error" && (
                        <span className="flex items-center gap-1 text-rose-400 font-bold text-[11px]">
                          <AlertCircle size={14} /> {item.error ?? "Failed"}
                        </span>
                      )}
                      {item.status === "extracting" && (
                        <Loader2 size={14} className="animate-spin text-brass" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Duplicate Resolution Popup */}
          {activeDuplicate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border p-5 space-y-4"
              style={{ backgroundColor: "var(--bg-desk)", borderColor: "var(--accent-brass)" }}
            >
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                <AlertCircle size={18} />
                <span>Duplicate Book Detected</span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                The book &quot;{activeDuplicate.extractedMetadata?.title}&quot; already exists in your personal library.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <button
                  onClick={() => handleResolveDuplicate("replace")}
                  className="rounded-xl border p-2.5 text-xs font-bold transition hover:bg-brass hover:text-black"
                  style={{ borderColor: "var(--border-strong)" }}
                >
                  Replace
                </button>
                <button
                  onClick={() => handleResolveDuplicate("keep_both")}
                  className="rounded-xl border p-2.5 text-xs font-bold transition hover:bg-brass hover:text-black"
                  style={{ borderColor: "var(--border-strong)" }}
                >
                  Keep Both
                </button>
                <button
                  onClick={() => handleResolveDuplicate("merge")}
                  className="rounded-xl border p-2.5 text-xs font-bold transition hover:bg-brass hover:text-black"
                  style={{ borderColor: "var(--border-strong)" }}
                >
                  Merge Specs
                </button>
                <button
                  onClick={() => handleResolveDuplicate("skip")}
                  className="rounded-xl border p-2.5 text-xs font-bold opacity-70 hover:opacity-100"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  Skip File
                </button>
              </div>
            </motion.div>
          )}

          {/* Recently Imported Shelf */}
          {importedHistory.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent-brass)" }}>
                Recently Imported Library Books ({importedHistory.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {importedHistory.slice(0, 4).map((book) => (
                  <div key={book.id} className="rounded-2xl border p-3 flex flex-col justify-between" style={{ backgroundColor: "var(--bg-desk)", borderColor: "var(--border-subtle)" }}>
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border mb-2" style={{ backgroundColor: "var(--bg-main)", borderColor: "var(--border-subtle)" }}>
                      {book.coverUrl ? (
                        <Image src={book.coverUrl} alt={book.title} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center p-2 font-display text-xs font-bold text-center">
                          {book.title}
                        </div>
                      )}
                    </div>
                    <h5 className="truncate font-bold text-xs">{book.title}</h5>
                    <p className="truncate text-[10px]" style={{ color: "var(--text-dim)" }}>{book.authors[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
