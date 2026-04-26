"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCVStore } from "@/store/useCVStore";
import {
  Plus,
  Trash2,
  Languages as LanguagesIcon,
  AlertCircle,
  Info,
} from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { languageSchema } from "@/lib/schemas";
import { LANGUAGE_LEVELS, COMMON_LANGUAGES } from "@/lib/cv-helpers";

const formSchema = z.object({ languages: z.array(languageSchema) });
type FormValues = z.infer<typeof formSchema>;

export default function StepLanguages() {
  const { cvData, updateLanguage, addLanguage, removeLanguage, _hasHydrated } = useCVStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: { languages: cvData.languages },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "languages",
    keyName: "_key",
  });

  useEffect(() => {
    form.reset({ languages: useCVStore.getState().cvData.languages });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, cvData.languages.length]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      values.languages?.forEach((lang) => {
        if (lang?.id) updateLanguage(lang.id, lang as Partial<typeof lang>);
      });
    });
    return () => subscription.unsubscribe();
  }, [form, updateLanguage]);

  /* Duplikasyon tespiti */
  const watchedLanguages = form.watch("languages") ?? [];
  const duplicateIds = new Set<string>();
  const seen = new Map<string, string>();
  watchedLanguages.forEach((l) => {
    if (!l) return;
    const key = l.name?.trim().toLowerCase() ?? "";
    if (!key) return;
    if (seen.has(key)) {
      duplicateIds.add(l.id);
      duplicateIds.add(seen.get(key)!);
    } else {
      seen.set(key, l.id);
    }
  });

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#0A1930] mb-2 tracking-tight">
            Yabancı Diller
          </h2>
          <p className="text-[#8A9EBD] text-sm font-medium">
            Uluslararası şirketlerde ATS filtresi; CEFR seviyeleri (A1–C2) tüm
            sistemlerce tanınan standarttır.
          </p>
        </div>
        <Button
          type="button"
          onClick={addLanguage}
          className="group bg-[#F4F7FA] text-[#0052CC] hover:bg-[#0052CC] hover:text-white font-black text-[10px] uppercase tracking-widest h-auto px-5 py-3 rounded-2xl shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90 duration-300" />
          Yeni Dil
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {fields.length === 0 ? (
            <div className="text-center py-16 bg-[#F4F7FA] rounded-[2rem] border border-dashed border-[#CBD6E2] flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <LanguagesIcon className="w-8 h-8 text-[#0052CC]/40" />
              </div>
              <p className="text-[#8A9EBD] font-medium text-sm">
                Bildiğiniz dilleri ve seviyelerini ekleyin.
                <br />
                <span className="text-[10px] mt-2 block">
                  Türkçe (Anadil), İngilizce (C1), Almanca (B2)...
                </span>
              </p>
            </div>
          ) : (
            fields.map((field, index) => {
              const isDup = duplicateIds.has(field.id);
              const datalistId = `lang-suggestions-${field._key}`;

              return (
                <div
                  key={field._key}
                  className="bg-white p-5 md:p-6 rounded-2xl border border-[#E6F0FA] relative group transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,82,204,0.05)] hover:border-[#0052CC]/30"
                >
                  <div className="flex items-end gap-4 flex-wrap md:flex-nowrap">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#0A1930] to-[#0052CC] text-white rounded-xl flex items-center justify-center font-black text-xs shadow-[0_4px_15px_rgba(0,82,204,0.3)] shrink-0 mb-px">
                      {index + 1}
                    </div>

                    <FormField
                      control={form.control}
                      name={`languages.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[200px]">
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                            Dil
                            <span className="text-red-400 ml-0.5">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              list={datalistId}
                              placeholder="Örn: İngilizce"
                              maxLength={40}
                              aria-invalid={isDup}
                              className={
                                isDup
                                  ? "border-red-300 focus:border-red-400"
                                  : ""
                              }
                            />
                          </FormControl>
                          <datalist id={datalistId}>
                            {COMMON_LANGUAGES.map((l) => (
                              <option key={l} value={l} />
                            ))}
                          </datalist>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`languages.${index}.level`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[200px]">
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                            Seviye
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LANGUAGE_LEVELS.map((lvl) => (
                                <SelectItem key={lvl.code} value={lvl.code}>
                                  {lvl.label} — {lvl.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLanguage(field.id)}
                      aria-label="Bu dili sil"
                      className="w-9 h-9 bg-white text-[#8A9EBD] border border-[#E6F0FA] hover:bg-red-50 hover:text-red-500 transition-all shadow-sm shrink-0 rounded-xl mb-px"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {isDup && (
                    <p className="mt-2 pl-1 text-[9px] text-red-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Bu dil birden fazla kez eklenmiş.
                    </p>
                  )}
                </div>
              );
            })
          )}

          {fields.length > 0 && (
            <p className="pl-1 pt-2 text-[10px] text-[#8A9EBD] font-medium flex items-center gap-2">
              <Info className="w-3.5 h-3.5 shrink-0 text-[#0052CC]" />
              İpucu: &quot;Akıcı&quot;, &quot;İyi derecede&quot; gibi sübjektif
              ifadeler yerine CEFR seviyeleri kullanın — ATS sadece bunları
              tanır.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
