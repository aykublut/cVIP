"use client";

import { useRef } from "react";
import { useCVStore } from "@/store/useCVStore";
import { Camera, Trash2 } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  className?: string;
}

export default function ImageUploader({ className = "" }: ImageUploaderProps) {
  const { cvData, updatePersonalInfo, isEditMode } = useCVStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photo = cvData.personalInfo.photo;

  // Dosya seçildiğinde çalışacak fonksiyon (Dosyayı Base64 string'e çevirir)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Resim boyutunu kontrol et (Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Lütfen 2MB'den küçük bir fotoğraf seçin.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Çıkan sonucu mağazaya kaydet
      updatePersonalInfo({ photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    updatePersonalInfo({ photo: "" });
  };

  // Önizleme Modunda (veya Edit modunda ama fotoğraf yokken Edit Mode'u kapatmışsa)
  if (!isEditMode && !photo) return null;

  return (
    <div className={`relative group ${className}`}>
      {/* Gizli Dosya Input'u */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/20 bg-slate-200/50 flex items-center justify-center relative">
        {photo ? (
          // Yüklenen Resmi Göster (Next.js Image componenti yerine img kullanıyoruz çünkü base64 kullanıyoruz)
          <img
            src={photo}
            alt="Profil"
            className="w-full h-full object-cover"
          />
        ) : (
          // Resim Yoksa Yer Tutucu (Sadece Edit Modunda Görünür)
          isEditMode && <Camera className="w-8 h-8 text-slate-400" />
        )}

        {/* Edit Modunda Hover Olunca Çıkan Menü (Siyah Overlay) */}
        {isEditMode && (
          <div
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer"
            onClick={() => !photo && fileInputRef.current?.click()}
          >
            {photo ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="bg-white/20 hover:bg-white/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm"
                >
                  Değiştir
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePhoto();
                  }}
                  className="bg-red-500/80 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Sil
                </button>
              </>
            ) : (
              <span className="text-white text-xs font-medium px-2 text-center">
                Fotoğraf Ekle
                <br />
                (Max 2MB)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
