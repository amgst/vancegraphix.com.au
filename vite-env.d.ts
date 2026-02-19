/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WEB3FORMS_ACCESS_KEY: string
    readonly VITE_IMGBB_API_KEY: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
