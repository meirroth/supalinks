<template>
  <p>Redirecting...</p>
</template>

<script setup lang="ts">
const from = useRoute().params.from as string

const { data: link } = await useFetch(`/api/link/${from}`)

if (link.value) {
  $fetch(`/api/click/${link.value.id}`, { method: 'POST' })

  await navigateTo(link.value.to, { external: true })
} else {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}
</script>
