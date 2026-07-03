import { WelcomeStep } from "../steps/WelcomeStep";
import { FullNameStep } from "../steps/FullNameStep";
import { PreferredNameStep } from "../steps/PreferredNameStep";
import { EmailStep } from "../steps/EmailStep";
import { PhoneStep } from "../steps/PhoneStep";
import { IdentityStep } from "../steps/IdentityStep";
import { GenderProvinceStep } from "../steps/GenderProvinceStep";
import { AddressStep } from "../steps/AddressStep";
import { StatusStep } from "../steps/StatusStep";
import { TopicStep } from "../steps/TopicStep";
import { StoryStep } from "../steps/StoryStep";
import { MethodDateStep } from "../steps/MethodDateStep";
import { ScheduleStep } from "../steps/ScheduleStep";
import { InformationSourceStep } from "../steps/InformationSourceStep";
import { ReviewStep } from "../steps/ReviewStep";
import { StepConfig } from "../types/booking";

export const BOOKING_STEPS: StepConfig[] = [
  {
    id: "welcome",
    component: WelcomeStep,
    fieldsToValidate: [],
  },
  {
    id: "full_name",
    component: FullNameStep,
    fieldsToValidate: ["nama_lengkap"],
  },
  {
    id: "preferred_name",
    component: PreferredNameStep,
    fieldsToValidate: ["nama_panggilan"],
  },
  {
    id: "email",
    component: EmailStep,
    fieldsToValidate: ["email"],
  },
  {
    id: "phone",
    component: PhoneStep,
    fieldsToValidate: ["nomor_hp"],
  },
  {
    id: "identity",
    component: IdentityStep,
    fieldsToValidate: ["tanggal_lahir", "nik"],
  },
  {
    id: "gender_province",
    component: GenderProvinceStep,
    fieldsToValidate: ["jenis_kelamin", "provinsi"],
  },
  {
    id: "address",
    component: AddressStep,
    fieldsToValidate: ["alamat_lengkap"],
  },
  {
    id: "status",
    component: StatusStep,
    fieldsToValidate: ["status", "status_lainnya"],
  },
  {
    id: "topic",
    component: TopicStep,
    fieldsToValidate: ["topik_permasalahan", "topik_lainnya"],
  },
  {
    id: "story",
    component: StoryStep,
    fieldsToValidate: ["ceritakan_permasalahan"],
  },
  {
    id: "method_date",
    component: MethodDateStep,
    fieldsToValidate: ["metode_konsultasi", "tanggal_konsultasi"],
  },
  {
    id: "schedule",
    component: ScheduleStep,
    fieldsToValidate: ["waktu_konsultasi"],
  },
  {
    id: "information_source",
    component: InformationSourceStep,
    fieldsToValidate: ["alasan", "alasan_lainnya", "urutan_konseling", "sumber_informasi", "sumber_informasi_lainnya"],
  },
  {
    id: "review",
    component: ReviewStep,
    fieldsToValidate: [],
  }
];

export const TOTAL_STEPS = BOOKING_STEPS.length;
