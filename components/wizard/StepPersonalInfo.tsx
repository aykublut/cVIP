"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCVStore } from "@/store/useCVStore";
import {
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  AlignLeft,
  Info,
  ImageOff,
  AlertCircle,
} from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { personalInfoSchema, type PersonalInfoInput } from "@/lib/schemas";
import {
  formatPhone,
  normalizeLinkedIn,
  normalizeGithub,
} from "@/lib/cv-helpers";
import { FieldEnhancer } from "@/components/ai/FieldEnhancer";

const SUMMARY_MIN = 250;
const SUMMARY_MAX = 600;
const PHOTO_MAX_SIZE = 2 * 1024 * 1024;

export default function StepPersonalInfo() {
  const { cvData, updatePersonalInfo, _hasHydrated } = useCVStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PersonalInfoInput>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onBlur",
    defaultValues: cvData.personalInfo,
  });

  /* localStorage hydration tamamlandığında formu gerçek veriyle doldur */
  useEffect(() => {
    if (_hasHydrated) {
      form.reset(useCVStore.getState().cvData.personalInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated]);

  /* Canlı senkronizasyon: form → store */
  useEffect(() => {
    const subscription = form.watch((values) => {
      updatePersonalInfo(values as Partial<PersonalInfoInput>);
    });
    return () => subscription.unsubscribe();
  }, [form, updatePersonalInfo]);

  const summaryValue = form.watch("summary") ?? "";
  const photoValue = form.watch("photo") ?? "";
  const summaryLen = summaryValue.length;
  const summaryInIdealRange =
    summaryLen >= SUMMARY_MIN && summaryLen <= SUMMARY_MAX;

  /* Fotoğraf yükleme */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > PHOTO_MAX_SIZE) {
      form.setError("photo", {
        type: "manual",
        message: "Fotoğraf boyutu 2 MB'ı aşmamalı.",
      });
      return;
    }
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      form.setError("photo", {
        type: "manual",
        message: "Sadece JPG, PNG veya WEBP formatı kabul edilir.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      form.setValue("photo", reader.result as string, { shouldValidate: true });
      form.clearErrors("photo");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-[#0A1930] mb-2 tracking-tight">
          Kişisel Bilgiler
        </h2>
        <p className="text-[#8A9EBD] text-sm font-medium">
          ATS&apos;nin ilk taradığı alan. Her veri standart formatta saklanır ve
          otomatik doğrulanır.
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* ÜST: Fotoğraf + Ad/Unvan */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Fotoğraf */}
            <div className="flex flex-col items-center gap-3 shrink-0 mt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-full bg-gradient-to-br from-[#E6F0FA] to-[#F4F7FA] shadow-[0_8px_20px_rgba(0,20,50,0.03)] border border-[#E6F0FA] transition-transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/30"
                aria-label="Profil fotoğrafı yükle"
              >
                {photoValue ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoValue}
                    alt="Profil fotoğrafı"
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-[#F4F7FA] flex items-center justify-center">
                    <User className="w-10 h-10 text-[#CBD6E2]" />
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
              {photoValue ? (
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("photo", "", { shouldValidate: true });
                    form.clearErrors("photo");
                  }}
                  className="text-[9px] text-red-400 font-black uppercase tracking-[0.15em] hover:text-red-600 transition-colors"
                >
                  Fotoğrafı Kaldır
                </button>
              ) : (
                <span className="text-[9px] text-[#8A9EBD] font-black uppercase tracking-[0.2em]">
                  OPSİYONEL
                </span>
              )}
              {form.formState.errors.photo && (
                <p className="text-[9px] text-red-400 font-bold">
                  {form.formState.errors.photo.message}
                </p>
              )}
            </div>

            {/* Ad & Unvan */}
            <div className="flex-1 space-y-5 w-full">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                      <User className="w-3 h-3 text-[#0052CC]" /> Ad Soyad
                      <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Örn: Ahmet Yılmaz"
                        maxLength={60}
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                      <Briefcase className="w-3 h-3 text-[#0052CC]" /> Hedef
                      Pozisyon
                      <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Örn: Senior Software Engineer"
                        maxLength={80}
                      />
                    </FormControl>
                    <FormDescription className="flex items-center gap-1 text-[9px]">
                      <Info className="w-3 h-3 shrink-0" />
                      Sektörün tanıdığı standart unvan kullanın — &quot;Ninja
                      Coder&quot; gibi yaratıcı unvanlar ATS aramalarında
                      eşleşmez.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Fotoğraf ATS uyarısı */}
          {photoValue && (
            <Alert className="bg-amber-50 border-amber-200">
              <ImageOff className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-[10px] text-amber-800 font-medium">
                <strong className="text-[11px] text-amber-900 tracking-wide block mb-1">
                  FOTOĞRAFLI CV — ATS UYARISI
                </strong>
                Eski ATS sistemleri (Oracle Taleo, iCIMS legacy) fotoğraflı
                CV&apos;lerde veri kaybına yol açabilir. ABD/UK başvurularında
                ayrımcılık riski nedeniyle önerilmez; TR/AB için opsiyoneldir.
              </AlertDescription>
            </Alert>
          )}

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E6F0FA] to-transparent" />

          {/* İLETİŞİM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                    <Mail className="w-3 h-3 text-[#0052CC]" /> E-Posta
                    <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="ad.soyad@domain.com"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                    <Phone className="w-3 h-3 text-[#0052CC]" /> Telefon
                    <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="+90 555 123 45 67"
                      autoComplete="tel"
                      inputMode="tel"
                      maxLength={20}
                      onBlur={(e) => {
                        field.onBlur();
                        const formatted = formatPhone(e.target.value);
                        if (formatted !== e.target.value) {
                          form.setValue("phone", formatted, {
                            shouldValidate: true,
                          });
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription className="flex items-center gap-1 text-[9px]">
                    <Info className="w-3 h-3 shrink-0" />
                    Uluslararası format otomatik uygulanır.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                    <MapPin className="w-3 h-3 text-[#0052CC]" /> Lokasyon
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Konya, Türkiye"
                      maxLength={60}
                      autoComplete="address-level2"
                    />
                  </FormControl>
                  <FormDescription className="flex items-center gap-1 text-[9px]">
                    <Info className="w-3 h-3 shrink-0" />
                    Açık adres eklemeyin — sadece şehir ve ülke.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                    <FaLinkedin className="w-3 h-3 text-[#0052CC]" /> LinkedIn
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="linkedin.com/in/kullaniciadi"
                      autoComplete="url"
                      onBlur={(e) => {
                        field.onBlur();
                        if (e.target.value) {
                          const normalized = normalizeLinkedIn(e.target.value);
                          if (normalized !== e.target.value) {
                            form.setValue("linkedin", normalized, {
                              shouldValidate: true,
                            });
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                    <FaGithub className="w-3 h-3 text-[#0052CC]" /> GitHub
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="github.com/kullaniciadi"
                      autoComplete="url"
                      onBlur={(e) => {
                        field.onBlur();
                        if (e.target.value) {
                          const normalized = normalizeGithub(e.target.value);
                          if (normalized !== e.target.value) {
                            form.setValue("github", normalized, {
                              shouldValidate: true,
                            });
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Profesyonel Özet */}
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between pl-1">
                  <FormLabel className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em]">
                    <AlignLeft className="w-3 h-3 text-[#0052CC]" /> Profesyonel
                    Özet
                  </FormLabel>
                  <span
                    className={`text-[9px] font-bold tabular-nums transition-colors ${
                      summaryLen > SUMMARY_MAX * 0.95
                        ? "text-red-400"
                        : summaryInIdealRange
                          ? "text-emerald-500"
                          : "text-[#CBD6E2]"
                    }`}
                  >
                    {summaryLen}/{SUMMARY_MAX}
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder="Deneyim, uzmanlık alanları ve en güçlü 2–3 başarıyı içeren 3–5 cümlelik, anahtar kelimelerle zenginleştirilmiş bir özet yazın."
                    maxLength={SUMMARY_MAX}
                    className="resize-none"
                  />
                </FormControl>
                <FieldEnhancer
                  fieldId="summary"
                  fieldType="summary"
                  currentContent={field.value ?? ""}
                  jobTitle={form.watch("jobTitle") ?? ""}
                  onAccept={(newContent) => {
                    field.onChange(newContent);
                    updatePersonalInfo({ summary: newContent });
                  }}
                />
                {summaryLen > 0 && summaryLen < SUMMARY_MIN ? (
                  <FormDescription className="flex items-center gap-1 text-[9px] text-amber-500 font-bold">
                    <AlertCircle className="w-3 h-3" />
                    İdeal uzunluk 250–600 karakter. Biraz daha genişletin.
                  </FormDescription>
                ) : (
                  <FormDescription className="flex items-center gap-1 text-[9px]">
                    <Info className="w-3 h-3 shrink-0" />
                    İş ilanındaki anahtar kelimeleri doğal bir dille özete
                    yerleştirin.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
