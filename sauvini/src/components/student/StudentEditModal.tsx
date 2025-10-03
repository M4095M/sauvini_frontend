"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import type { UserProfile } from "@/types/modules";
import { X, Trash } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Student } from "@/api";

interface Props {
  open: boolean;
  user: Student;
  onClose: () => void;
  onSave?: (payload: Partial<UserProfile>) => Promise<void> | void;
}

export default function StudentEditModal({ open, user, onClose, onSave }: Props) {
  const { t, isRTL } = useLanguage();

  const [form, setForm] = useState({
    name: user.first_name ?? "",
    lastname: user.last_name ?? "",
    phoneNumber: user.phone_number ?? "",
    email: user.email ?? "",
    wilaya: user.wilaya ?? "",
    academicStream: (user.academic_stream as string) ?? "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  if (!open) return null;

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  const handleAvatarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) setAvatarFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    if (f && f.type.startsWith("image/")) setAvatarFile(f);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload: Partial<UserProfile> = {
      name: form.name.trim(),
      lastname: form.lastname?.trim(),
      phoneNumber: form.phoneNumber.trim(),
      email: form.email.trim(),
      wilaya: form.wilaya.trim(),
      academicStream: form.academicStream.trim() as any,
    };

    try {
      if (avatarFile) {
        const fd = new FormData();
        fd.append("file", avatarFile);
        fd.append("payload", JSON.stringify(payload));
        await fetch("/api/profile", { method: "PUT", body: fd });
      } else {
        await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await onSave?.(payload);
    } catch {
      onSave?.(payload);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  const inputClass =
    "appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none bg-white border border-neutral-200 px-5 py-3 rounded-full w-full text-work-sans font-normal text-base text-neutral-600 dark:bg-[#0B0B0B] dark:border-gray-700 dark:text-neutral-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir={isRTL ? "rtl" : "ltr"} aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/50" onClick={onClose} />

      <style jsx>{`
        /* hide native scrollbar while keeping scroll functionality */
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex flex-col bg-[var(--Surface-Level-2,#F8F8F8)] dark:bg-[#1A1A1A] rounded-[60px] shadow-xl"
        style={{ width: 868, maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-10 pt-11 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">{t("profile.editTitle") ?? "Edit Profile"}</h3>
              <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t("profile.editSubtitle") ?? "Edit the details about yourself"}</div>
            </div>

            <button aria-label={t("common.close") ?? "Close"} onClick={onClose} className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <X className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-10 pb-10 no-scrollbar">
          <div className="flex flex-col gap-8">
            {/* Avatar dropzone */}
            <div>
              <label className="text-sm text-neutral-700 dark:text-neutral-300">{t("profile.picture") ?? "Profile Picture"}</label>

              <label
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleDrop}
                className={[
                  "mt-2 block w-full rounded-2xl border-2 border-dashed cursor-pointer transition-colors min-h-[100px] p-4",
                  isDragging ? "border-blue-400 bg-blue-50/30 dark:bg-blue-900/20" : "border-gray-300 dark:border-white/20 bg-white dark:bg-transparent"
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex items-center justify-center">
                      {avatarPreview ? <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" /> : <div className="text-neutral-400">🖼</div>}
                    </div>
                    <div className="text-sm text-neutral-700 dark:text-neutral-300">
                      {avatarFile ? avatarFile.name : (t("profile.dragOrBrowse") ?? "Drag your image or browse")}
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{t("profile.maxSizeHint") ?? "Max 5 MB. JPG/PNG."}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="file" accept="image/*" onChange={handleAvatarInput} className="hidden" id="student-avatar-input" />
                    <label htmlFor="student-avatar-input" className="px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800 text-sm cursor-pointer">{t("common.browse") ?? "Browse"}</label>
                    {avatarFile && <button onClick={handleRemoveAvatar} className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"><Trash className="w-4 h-4 text-neutral-600 dark:text-neutral-300" /></button>}
                  </div>
                </div>
              </label>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300">{t("profile.firstName") ?? "First Name"}</label>
                <input aria-label={t("profile.firstName") ?? "First Name"} value={form.name} onChange={handleChange("name")} className={`mt-2 ${inputClass}`} />
              </div>

              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300">{t("profile.lastName") ?? "Last Name"}</label>
                <input aria-label={t("profile.lastName") ?? "Last Name"} value={form.lastname} onChange={handleChange("lastname")} className={`mt-2 ${inputClass}`} />
              </div>

              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300">{t("profile.phoneNumber") ?? "Phone number"}</label>
                <input aria-label={t("profile.phoneNumber") ?? "Phone number"} value={form.phoneNumber} onChange={handleChange("phoneNumber")} className={`mt-2 ${inputClass}`} />
              </div>

              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300">{t("profile.wilaya") ?? "Wilaya"}</label>
                <input aria-label={t("profile.wilaya") ?? "Wilaya"} value={form.wilaya} onChange={handleChange("wilaya")} className={`mt-2 ${inputClass}`} />
              </div>

              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300">{t("profile.academicStream") ?? "Academic Stream"}</label>
                <input aria-label={t("profile.academicStream") ?? "Academic Stream"} value={form.academicStream} onChange={handleChange("academicStream")} className={`mt-2 ${inputClass}`} />
              </div>

              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300">{t("profile.email") ?? "Email"}</label>
                <input aria-label={t("profile.email") ?? "Email"} value={form.email} onChange={handleChange("email")} className={`mt-2 ${inputClass}`} />
              </div>
            </div>

            {/* Actions */}
            <div className="w-full flex items-center justify-end gap-3 pt-4">
              <Button state="text" icon_position="none" size="S" text={t("common.cancel") ?? "Cancel"} onClick={onClose} optionalStyles="!px-6 !py-3" />
              <Button state="filled" icon_position="none" size="S" text={t("profile.saveChanges") ?? "Save Changes"} onClick={handleSave} disabled={saving} optionalStyles="!px-6 !py-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}