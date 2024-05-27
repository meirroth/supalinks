<template>
  <UContainer>
    <div class="mx-auto max-w-xs py-10">
      <p>Redirecting...</p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const from = useRoute().params.from as string

const { data } = await useFetch(`/api/link/${from}`)

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

await navigateTo(data.value.to, { external: true })
</script>
