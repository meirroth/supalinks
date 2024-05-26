<template>
  <UContainer>
    <div class="mx-auto max-w-xs py-10">
      <p>Redirecting...</p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { Database } from '@/types/supabase'

const client = useSupabaseClient<Database>()

const from = useRoute().params.from as string

const { data, error } = await client
  .from('links')
  .select('*')
  .eq('from', from)
  .single()

if (error) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

await navigateTo(data.to, { external: true })
</script>
