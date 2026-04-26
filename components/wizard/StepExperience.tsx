"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCVStore } from "@/store/useCVStore";
import {
  Plus,
  Trash2,
  Briefcase,
  ChevronRight,
  AlertCircle,
  Info,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

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
} from "@/components/ui/form";
import { MonthYearPicker } from "@/components/ui/month-year-picker";

import { experienceSchema } from "@/lib/schemas";
import { hasMetric, looksLikeActionVerb } from "@/lib/cv-helpers";
import { FieldEnhancer } from "@/components/ai/FieldEnhancer";

const DESCRIPTION_MAX = 600;

const formSchema = z.object({
  experiences: z.array(experienceSchema),
});
type FormValues = z.infer<typeof formSchema>;

export default function StepExperience() {
  const { cvData, updateExperience, addExperience, removeExperience, _hasHydrated } =
    useCVStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: { experiences: cvData.experiences },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "experiences",
    keyName: "_key",
  });

  /* Store değişikliklerini form'a yansıt — hydration + ekleme/silme sonrası */
  useEffect(() => {
    form.reset({ experiences: useCVStore.getState().cvData.experiences });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, cvData.experiences.length]);

  /* Form değişikliklerini store'a yaz */
  useEffect(() => {
    const subscription = form.watch((values) => {
      values.experiences?.forEach((exp) => {
        if (exp?.id) {
          updateExperience(exp.id, exp as Partial<typeof exp>);
        }
      });
    });
    return () => subscription.unsubscribe();
  }, [form, updateExperience]);

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#0A1930] mb-2 tracking-tight">
            İş Deneyimi
          </h2>
          <p className="text-[#8A9EBD] text-sm font-medium">
            ATS&apos;nin en ağır puanladığı bölüm. Her kayıt için aynı yapıyı
            koruyun.
          </p>
        </div>
        <Button
          type="button"
          onClick={addExperience}
          className="group bg-[#F4F7FA] text-[#0052CC] hover:bg-[#0052CC] hover:text-white font-black text-[10px] uppercase tracking-widest h-auto px-5 py-3 rounded-2xl shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90 duration-300" />
          Yeni Pozisyon
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {fields.length === 0 ? (
            <div className="text-center py-16 bg-[#F4F7FA] rounded-[2rem] border border-dashed border-[#CBD6E2] flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-[#0052CC]/40" />
              </div>
              <p className="text-[#8A9EBD] font-medium text-sm">
                İlk iş deneyiminizi ekleyerek
                <br />
                kariyer hikayenizi oluşturmaya başlayın.
              </p>
            </div>
          ) : (
            fields.map((field, index) => {
              const desc = form.watch(`experiences.${index}.description`) ?? "";
              const descHasMetric = hasMetric(desc);
              const descActionVerb = looksLikeActionVerb(desc);

              return (
                <div
                  key={field._key}
                  className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#E6F0FA] relative group transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,82,204,0.06)] hover:border-[#0052CC]/30"
                >
                  <div className="absolute left-0 top-8 bottom-8 w-1.5 bg-[#0052CC] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute -left-3 -top-3 w-10 h-10 bg-gradient-to-br from-[#0A1930] to-[#0052CC] text-white rounded-xl flex items-center justify-center font-black text-sm shadow-[0_4px_15px_rgba(0,82,204,0.3)] transform transition-transform group-hover:scale-110">
                    {index + 1}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperience(field.id)}
                    aria-label="Bu deneyimi sil"
                    className="absolute right-6 top-6 w-9 h-9 bg-white text-[#8A9EBD] border border-[#E6F0FA] hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all opacity-0 group-hover:opacity-100 shadow-sm rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5 mb-5 mt-2">
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.position`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                            Pozisyon / Unvan
                            <span className="text-red-400 ml-0.5">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Örn: Senior Software Engineer"
                              maxLength={80}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experiences.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                            Kurum / Şirket
                            <span className="text-red-400 ml-0.5">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Örn: Google Inc."
                              maxLength={80}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Tarih aralığı */}
                    <div className="md:col-span-2 flex items-end gap-3">
                      <FormField
                        control={form.control}
                        name={`experiences.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                              Başlangıç
                              <span className="text-red-400 ml-0.5">*</span>
                            </FormLabel>
                            <FormControl>
                              <MonthYearPicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Tarih seçin"
                                aria-label="Başlangıç tarihi"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="pb-3">
                        <ChevronRight className="w-4 h-4 text-[#CBD6E2]" />
                      </div>
                      <FormField
                        control={form.control}
                        name={`experiences.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                              Bitiş
                              <span className="text-red-400 ml-0.5">*</span>
                            </FormLabel>
                            <FormControl>
                              <MonthYearPicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Tarih veya Günümüz"
                                allowPresent
                                aria-label="Bitiş tarihi"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Açıklama */}
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between pl-1">
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em]">
                            Başarılar & Sorumluluklar
                          </FormLabel>
                          <span
                            className={`text-[9px] font-bold tabular-nums ${
                              desc.length > DESCRIPTION_MAX * 0.9
                                ? "text-red-400"
                                : "text-[#CBD6E2]"
                            }`}
                          >
                            {desc.length}/{DESCRIPTION_MAX}
                          </span>
                        </div>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={4}
                            maxLength={DESCRIPTION_MAX}
                            placeholder="Her satıra bir başarı veya sorumluluk. Aksiyon fiiliyle başlayın (Geliştirdim, Yönettim, Artırdım) ve sayısal metrik ekleyin. Örn: API yanıt süresini mikroservis mimarisine geçişle %40 azalttım."
                            className="resize-none"
                          />
                        </FormControl>

                        {/* ATS Pills */}
                        {desc.length > 30 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            <div
                              className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-lg ${
                                descHasMetric
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              <TrendingUp className="w-3 h-3" />
                              {descHasMetric
                                ? "Sayısal metrik var"
                                : "Sayısal metrik ekleyin"}
                            </div>
                            <div
                              className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-lg ${
                                descActionVerb
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {descActionVerb ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <AlertCircle className="w-3 h-3" />
                              )}
                              {descActionVerb
                                ? "Güçlü cümle başlangıcı"
                                : "Aksiyon fiiliyle başlayın"}
                            </div>
                          </div>
                        )}
                        {desc.length <= 30 && (
                          <p className="mt-2 pl-1 text-[9px] text-[#8A9EBD] font-medium flex items-center gap-1">
                            <Info className="w-3 h-3 shrink-0" />
                            Rakamlarla desteklenmiş başarılar ATS sıralamanızda
                            kritik avantaj sağlar.
                          </p>
                        )}
                        <FieldEnhancer
                          fieldId={`exp-desc-${index}`}
                          fieldType="experience"
                          currentContent={desc}
                          jobTitle={form.watch(`experiences.${index}.position`) ?? ""}
                          onAccept={(newContent) => {
                            const expId = form.getValues(`experiences.${index}.id`);
                            form.setValue(`experiences.${index}.description`, newContent, { shouldDirty: true });
                            updateExperience(expId, { description: newContent });
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              );
            })
          )}
        </form>
      </Form>
    </div>
  );
}
