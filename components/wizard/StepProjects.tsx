"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCVStore } from "@/store/useCVStore";
import {
  Plus,
  Trash2,
  FolderGit2,
  ChevronRight,
  AlertCircle,
  Info,
  CheckCircle2,
  TrendingUp,
  Link2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MonthYearPicker } from "@/components/ui/month-year-picker";

import { projectSchema } from "@/lib/schemas";
import { hasMetric, looksLikeActionVerb } from "@/lib/cv-helpers";
import { FieldEnhancer } from "@/components/ai/FieldEnhancer";

const DESC_MAX = 500;

const formSchema = z.object({ projects: z.array(projectSchema) });
type FormValues = z.infer<typeof formSchema>;

/**
 * Ensures a URL always has an https:// prefix.
 * Without a protocol, PDF viewers treat the link as a local file path
 * (e.g. "github.com/user/repo" becomes "file:///github.com/user/repo").
 */
function ensureAbsoluteUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  // Already has a valid protocol — leave it alone
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Strip any accidental leading slashes before prepending
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

export default function StepProjects() {
  const { cvData, updateProject, addProject, removeProject, _hasHydrated } = useCVStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: { projects: cvData.projects },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "projects",
    keyName: "_key",
  });

  useEffect(() => {
    form.reset({ projects: useCVStore.getState().cvData.projects });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, cvData.projects.length]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      values.projects?.forEach((proj) => {
        if (proj?.id) updateProject(proj.id, proj as Partial<typeof proj>);
      });
    });
    return () => subscription.unsubscribe();
  }, [form, updateProject]);

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#0A1930] mb-2 tracking-tight">
            Projeler
          </h2>
          <p className="text-[#8A9EBD] text-sm font-medium">
            Teknik kabiliyetinizi kanıtlayan projeler. Yeni mezunlar ve
            geliştiriciler için deneyim kadar değerli.
          </p>
        </div>
        <Button
          type="button"
          onClick={addProject}
          className="group bg-[#F4F7FA] text-[#0052CC] hover:bg-[#0052CC] hover:text-white font-black text-[10px] uppercase tracking-widest h-auto px-5 py-3 rounded-2xl shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90 duration-300" />
          Yeni Proje
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {fields.length === 0 ? (
            <div className="text-center py-16 bg-[#F4F7FA] rounded-[2rem] border border-dashed border-[#CBD6E2] flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <FolderGit2 className="w-8 h-8 text-[#0052CC]/40" />
              </div>
              <p className="text-[#8A9EBD] font-medium text-sm">
                Öne çıkarmak istediğiniz projeleri ekleyin.
                <br />
                <span className="text-[10px] mt-2 block">
                  Açık kaynak katkılar, freelance işler, portföy projeleri...
                </span>
              </p>
            </div>
          ) : (
            fields.map((field, index) => {
              const desc = form.watch(`projects.${index}.description`) ?? "";
              const tech = form.watch(`projects.${index}.technologies`) ?? "";
              const descHasMetric = hasMetric(desc);
              const descActionVerb = looksLikeActionVerb(desc);

              return (
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
                    onClick={() => removeProject(field.id)}
                    aria-label="Bu projeyi sil"
                    className="absolute right-6 top-6 w-9 h-9 bg-white text-[#8A9EBD] border border-[#E6F0FA] hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5 mt-2">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                            Proje Adı
                            <span className="text-red-400 ml-0.5">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Örn: E-Ticaret Dashboard"
                              maxLength={100}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`projects.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                            Rol / Pozisyon
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Örn: Lead Developer"
                              maxLength={60}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`projects.${index}.technologies`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                            Kullanılan Teknolojiler
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="React, Node.js, PostgreSQL, AWS, Redis"
                              maxLength={200}
                            />
                          </FormControl>
                          <FormDescription className="text-[9px]">
                            <Info className="w-3 h-3 shrink-0 inline mr-1" />
                            Virgülle ayırın. ATS bu alanı skill olarak tarar —
                            iş ilanındaki teknolojileri buraya yansıtın.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`projects.${index}.url`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="flex items-center gap-2 text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                            <Link2 className="w-3 h-3" /> Proje Linki
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="github.com/kullanici/proje veya proje.com"
                              onBlur={(e) => {
                                field.onBlur();
                                if (e.target.value) {
                                  // ✅ FIX: always prepend https:// so PDF viewers
                                  // open links in the browser, not the local file system.
                                  const normalized = ensureAbsoluteUrl(e.target.value);
                                  if (normalized !== e.target.value) {
                                    form.setValue(
                                      `projects.${index}.url`,
                                      normalized,
                                      { shouldValidate: true },
                                    );
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2 flex items-end gap-3">
                      <FormField
                        control={form.control}
                        name={`projects.${index}.startDate`}
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
                        name={`projects.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                              Bitiş
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

                  <FormField
                    control={form.control}
                    name={`projects.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="mt-5">
                        <div className="flex items-center justify-between pl-1">
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em]">
                            Proje Açıklaması & Katkılar
                          </FormLabel>
                          <span
                            className={`text-[9px] font-bold tabular-nums ${
                              desc.length > DESC_MAX * 0.9
                                ? "text-red-400"
                                : "text-[#CBD6E2]"
                            }`}
                          >
                            {desc.length}/{DESC_MAX}
                          </span>
                        </div>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={3}
                            maxLength={DESC_MAX}
                            placeholder="Projenin amacını ve sizin katkınızı somut metriklerle yazın. Örn: 10.000+ aktif kullanıcı; sayfa yükleme süresini %60 iyileştirdim."
                            className="resize-none"
                          />
                        </FormControl>
                        {desc.length > 20 && (
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
                            {!tech.trim() && (
                              <div className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-lg bg-amber-50 text-amber-600">
                                <AlertCircle className="w-3 h-3" />
                                Teknolojileri eklemeyi unutmayın
                              </div>
                            )}
                          </div>
                        )}
                        <FieldEnhancer
                          fieldId={`proj-desc-${index}`}
                          fieldType="project"
                          currentContent={desc}
                          jobTitle={form.watch(`projects.${index}.name`) ?? ""}
                          onAccept={(newContent) => {
                            const projId = form.getValues(`projects.${index}.id`);
                            form.setValue(`projects.${index}.description`, newContent, { shouldDirty: true });
                            updateProject(projId, { description: newContent });
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
