import { useFormContext, useWatch } from "react-hook-form";
import { BookingFormData } from "@/lib/schemas/booking";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { CustomFormField } from "@/components/ui/custom-form-field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectableChip } from "@/components/ui/selectable-chip";

const TOPIK_OPTIONS = [
  "Keluarga", "Parenting", "Pranikah", "KDRT", "Hubungan", 
  "Duka & Kehilangan", "Perundungan", "Orientasi Seksual", 
  "Pelecehan / Kekerasan Seksual", "Kecanduan", "Akademik", 
  "Karir & Masa Depan", "Ekonomi", "Lainnya"
];

export function Step2InformasiKonsultasi() {
  const { control } = useFormContext<BookingFormData>();

  const status = useWatch({ control, name: "status" });
  const alasan = useWatch({ control, name: "alasan" });
  const topikPermasalahan = useWatch({ control, name: "topik_permasalahan" }) || [];
  const ceritakan = useWatch({ control, name: "ceritakan_permasalahan" }) || "";

  return (
    <div className="space-y-10">
      {/* Status */}
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Status saat ini *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3"
              >
                {["Pelajar", "Mahasiswa", "Orang Tua", "Lainnya"].map((item) => (
                  <SelectableChip key={item} value={item} label={item} />
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {status === "Lainnya" && (
        <div className="animate-fade-enter">
          <CustomFormField
            control={control}
            name="status_lainnya"
            label="Sebutkan Status Lainnya *"
            placeholder="Contoh: Pekerja Lepas"
          />
        </div>
      )}

      {/* Alasan */}
      <FormField
        control={control}
        name="alasan"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Alasan Menghubungi Layanan *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3"
              >
                {["Kemauan sendiri", "Saran dari teman", "Lainnya"].map((item) => (
                  <SelectableChip key={item} value={item} label={item} />
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {alasan === "Lainnya" && (
        <div className="animate-fade-enter">
          <CustomFormField
            control={control}
            name="alasan_lainnya"
            label="Sebutkan Alasan Lainnya *"
            placeholder="Contoh: Rujukan dari dokter"
          />
        </div>
      )}

      {/* Topik Permasalahan */}
      <FormField
        control={control}
        name="topik_permasalahan"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base font-semibold">Topik Permasalahan Secara Umum *</FormLabel>
              <FormDescription>Boleh pilih lebih dari satu.</FormDescription>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TOPIK_OPTIONS.map((item) => (
                <FormField
                  key={item}
                  control={control}
                  name="topik_permasalahan"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item}
                        className="flex flex-row items-start gap-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-[15px] cursor-pointer text-[#334155]">
                          {item}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {topikPermasalahan.includes("Lainnya") && (
        <div className="animate-fade-enter">
          <CustomFormField
            control={control}
            name="topik_lainnya"
            label="Sebutkan Topik Lainnya *"
            placeholder="Contoh: Quarter Life Crisis"
          />
        </div>
      )}

      {/* Ceritakan Permasalahan */}
      <div className="relative">
        <CustomFormField
          control={control}
          name="ceritakan_permasalahan"
          label="Ceritakan Permasalahan *"
          description="Tuliskan gambaran umum mengenai permasalahan yang ingin Anda konsultasikan. Informasi ini akan membantu tim kami memahami kebutuhan Anda."
          placeholder="Saya merasa kesulitan dalam..."
          isTextarea={true}
          maxLength={3000}
        />
        <div className="flex justify-end mt-2">
          <span className={`text-xs ${ceritakan.length < 50 || ceritakan.length > 3000 ? 'text-destructive' : 'text-neutral-500'}`}>
            {ceritakan.length} / 3000 karakter
          </span>
        </div>
      </div>
    </div>
  );
}
