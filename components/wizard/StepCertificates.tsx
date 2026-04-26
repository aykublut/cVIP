"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCVStore } from "@/store/useCVStore";
import {
  Plus,
  Trash2,
  Award,
  ChevronRight,
  Info,
  ShieldAlert,
} from "lucide-react";

import { Input } from "@/components/ui/input";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MonthYearPicker } from "@/components/ui/month-year-picker";

import { certificateSchema } from "@/lib/schemas";
import { isCertificateExpired, normalizeUrl } from "@/lib/cv-helpers";

const formSchema = z.object({ certificates: z.array(certificateSchema) });
type FormValues = z.infer<typeof formSchema>;

export default function StepCertificates() {
  const { cvData, updateCertificate, addCertificate, removeCertificate, _hasHydrated } =
    useCVStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: { certificates: cvData.certificates },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "certificates",
    keyName: "_key",
  });

  useEffect(() => {
    form.reset({ certificates: useCVStore.getState().cvData.certificates });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, cvData.certificates.length]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      values.certificates?.forEach((cert) => {
        if (cert?.id) updateCertificate(cert.id, cert as Partial<typeof cert>);
      });
    });
    return () => subscription.unsubscribe();
  }, [form, updateCertificate]);

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#0A1930] mb-2 tracking-tight">
            Sertifikalar
          </h2>
          <p className="text-[#8A9EBD] text-sm font-medium">
            ATS&apos;nin anahtar kelime taramasında yüksek puan getiren alan.
            Teknik roller için güçlü avantaj.
          </p>
        </div>
        <Button
          type="button"
          onClick={addCertificate}
          className="group bg-[#F4F7FA] text-[#0052CC] hover:bg-[#0052CC] hover:text-white font-black text-[10px] uppercase tracking-widest h-auto px-5 py-3 rounded-2xl shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90 duration-300" />
          Yeni Sertifika
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {fields.length === 0 ? (
            <div className="text-center py-16 bg-[#F4F7FA] rounded-[2rem] border border-dashed border-[#CBD6E2] flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <Award className="w-8 h-8 text-[#0052CC]/40" />
              </div>
              <p className="text-[#8A9EBD] font-medium text-sm">
                Profesyonel sertifikanız varsa
                <br />
                CV&apos;nizin ATS skorunu önemli ölçüde yükseltir.
                <br />
                <span className="text-[10px] mt-2 block">
                  Örn: AWS, PMP, Google Analytics, Scrum Master
                </span>
              </p>
            </div>
          ) : (
            fields.map((field, index) => {
              const expiryDate =
                form.watch(`certificates.${index}.expiryDate`) ?? "";
              const expired = isCertificateExpired(expiryDate);

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
                    onClick={() => removeCertificate(field.id)}
                    aria-label="Bu sertifikayı sil"
                    className="absolute right-6 top-6 w-9 h-9 bg-white text-[#8A9EBD] border border-[#E6F0FA] hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  {expired && (
                    <Alert className="mb-4 bg-red-50 border-red-200">
                      <ShieldAlert className="h-4 w-4 text-red-500" />
                      <AlertDescription className="text-[10px] text-red-700 font-bold">
                        Bu sertifikanın süresi dolmuş görünüyor. Yenilemeyi veya
                        kaldırmayı değerlendirin.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                    <FormField
                      control={form.control}
                      name={`certificates.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                            Sertifika Adı
                            <span className="text-red-400 ml-0.5">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Örn: AWS Certified Solutions Architect – Associate"
                              maxLength={120}
                            />
                          </FormControl>
                          <FormDescription className="text-[9px]">
                            <Info className="w-3 h-3 shrink-0 inline mr-1" />
                            Kısaltma ve açık ad birlikte: &quot;AWS SAA
                            (Solutions Architect Associate)&quot;.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`certificates.${index}.issuer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                            Veren Kurum
                            <span className="text-red-400 ml-0.5">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Amazon Web Services"
                              maxLength={80}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`certificates.${index}.credentialId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                            Doğrulama Kimliği
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="ABC123XYZ (opsiyonel)"
                              maxLength={60}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2 flex items-end gap-3">
                      <FormField
                        control={form.control}
                        name={`certificates.${index}.issueDate`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                              Alınma Tarihi
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
                        name={`certificates.${index}.expiryDate`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                              Süresi Bitiş
                            </FormLabel>
                            <FormControl>
                              <MonthYearPicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Süresiz veya tarih"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`certificates.${index}.credentialUrl`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] pl-1">
                            Doğrulama Linki
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="credly.com/badges/..."
                              onBlur={(e) => {
                                field.onBlur();
                                if (e.target.value) {
                                  const normalized = normalizeUrl(
                                    e.target.value,
                                  );
                                  if (normalized !== e.target.value) {
                                    form.setValue(
                                      `certificates.${index}.credentialUrl`,
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
                  </div>
                </div>
              );
            })
          )}

          {fields.length > 0 && (
            <p className="pl-1 text-[10px] text-[#8A9EBD] font-medium flex items-center gap-2">
              <Info className="w-3.5 h-3.5 shrink-0 text-[#0052CC]" />
              İpucu: En son alınan sertifikaları üste koyun; süresi dolmuşları
              kaldırın.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
