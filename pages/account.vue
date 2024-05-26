<template>
  <UContainer>
    <AccountView class="mx-auto max-w-xs py-10" />
  </UContainer>
</template>

<script setup lang="ts">
const user = useSupabaseUser()

if (!user.value) {
  await navigateTo('/login')
}

useSeoMeta({
  title: 'Account',
})
</script>
