<template>
  <UContainer>
    <div class="mx-auto max-w-xs py-10">
      <p>Redirecting...</p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const user = useSupabaseUser()

watch(
  user,
  () => {
    if (user.value) {
      return navigateTo('/')
    }
  },
  { immediate: true },
)

useSeoMeta({
  title: 'Confirming magic link...',
})
</script>
