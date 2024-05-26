<template>
  <UContainer>
    <LoginForm class="mx-auto max-w-xs py-10" />
  </UContainer>
</template>

<script setup lang="ts">
const user = useSupabaseUser()

if (user.value) {
  await navigateTo('/')
}

useSeoMeta({
  title: 'Login',
})
</script>
