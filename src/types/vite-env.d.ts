interface ImportMetaEnv {
  readonly VITE_USER_API_URL: string;
  readonly VITE_DOCTOR_API_URL: string;
  readonly VITE_ADMIN_API_URL: string;
  readonly VITE_Image_API_URL:string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
