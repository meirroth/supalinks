// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    // https://supabase.nuxtjs.org/
    '@nuxtjs/supabase',
    // https://ui.nuxt.com/
    '@nuxt/ui',
    // https://eslint.nuxt.com/packages/module
    '@nuxt/eslint',
  ],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: ['/account'],
    },
  },
})
