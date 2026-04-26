"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCVStore } from "@/store/useCVStore";
import { Plus, Trash2, GraduationCap, ChevronRight, Info } from "lucide-react";

import { Input } from "@/components/ui/input";
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

import { educationSchema } from "@/lib/schemas";
import { DEGREE_SUGGESTIONS } from "@/lib/cv-helpers";

const formSchema = z.object({ educations: z.array(educationSchema) });
type FormValues = z.infer<typeof formSchema>;

export default function StepEducation() {
  const { cvData, updateEducation, addEducation, removeEducation, _hasHydrated } =
    useCVStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: { educations: cvData.educations },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "educations",
    keyName: "_key",
  });

  useEffect(() => {
    form.reset({ educations: useCVStore.getState().cvData.educations });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, cvData.educations.length]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      values.educations?.forEach((edu) => {
        if (edu?.id) updateEducation(edu.id, edu as Partial<typeof edu>);
      });
    });
    return () => subscription.unsubscribe();
  }, [form, updateEducation]);

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#0A1930] mb-2 tracking-tight">
            Eğitim
          </h2>
          <p className="text-[#8A9EBD] text-sm font-medium">
            Akademik geçmişinizi kronolojik sırada, standart başlıklarla
            yapılandırın.
          </p>
        </div>
        <Button
          type="button"
          onClick={addEducation}
          className="group bg-[#F4F7FA] text-[#0052CC] hover:bg-[#0052CC] hover:text-white font-black text-[10px] uppercase tracking-widest h-auto px-5 py-3 rounded-2xl shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90 duration-300" />
          Yeni Eğitim
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {fields.length === 0 ? (
            <div className="text-center py-16 bg-[#F4F7FA] rounded-[2rem] border border-dashed border-[#CBD6E2] flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-[#0052CC]/40" />
              </div>
              <p className="text-[#8A9EBD] font-medium text-sm">
                Henüz eğitim eklemediniz.
                <br />
                Lisans veya sertifika bilgilerinizle başlayın.
              </p>
            </div>
          ) : (
            fields.map((field, index) => (
              <div
                key={field._key}
                className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#E6F0FA] relative group transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,82,204,0.06)] hover:border-[#0052CC]/30"
              >
                <div className="absolute left-0 top-8 bottom-8 w-1.5 bg-[#0052CC] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -left-3 -top-3 w-10 h-10 bg-gradient-to-br from-[#0A1930] to-[#0052CC] text-white rounded-xl flex items-center justify-center font-black text-sm shadow-[0_4px_15px_rgba(0,82,204,0.3)]">
                  {index + 1}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEducation(field.id)}
                  aria-label="Bu eğitimi sil"
                  className="absolute right-6 top-6 w-9 h-9 bg-white text-[#8A9EBD] border border-[#E6F0FA] hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                  <FormField
                    control={form.control}
                    name={`educations.${index}.school`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                          Kurum / Üniversite
                          <span className="text-red-400 ml-0.5">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Örn: Orta Doğu Teknik Üniversitesi"
                            maxLength={120}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`educations.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                          Derece / Diploma
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            list={`degree-suggestions-${field.name}`}
                            placeholder="Lisans / Yüksek Lisans"
                            maxLength={60}
                          />
                        </FormControl>
                        <datalist id={`degree-suggestions-${field.name}`}>
                          {DEGREE_SUGGESTIONS.map((d) => (
                            <option key={d} value={d} />
                          ))}
                        </datalist>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`educations.${index}.fieldOfStudy`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                          Bölüm / Alan
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Örn: Bilgisayar Mühendisliği"
                            maxLength={80}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2 flex items-end gap-3">
                    <FormField
                      control={form.control}
                      name={`educations.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                            Başlangıç
                          </FormLabel>
                          <FormControl>
                            <MonthYearPicker
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Tarih seçin"
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
                      name={`educations.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                            Mezuniyet
                          </FormLabel>
                          <FormControl>
                            <MonthYearPicker
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Tarih veya Günümüz"
                              allowPresent
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))
          )}

          {fields.length > 0 && (
            <p className="pl-1 text-[10px] text-[#8A9EBD] font-medium flex items-center gap-2">
              <Info className="w-3.5 h-3.5 shrink-0 text-[#0052CC]" />
              İpucu: Eğitimleri en yeniden en eskiye doğru sıralayın. ATS
              kronolojik düzen bekler.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
