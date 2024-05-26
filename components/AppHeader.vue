<template>
  <nav class="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
    <UContainer class="flex items-center justify-between gap-4 py-4">
      <div>
        <NuxtLink to="/" class="font-semibold">My Tasks</NuxtLink>
      </div>
      <div class="flex items-center gap-4">
        <UDropdown v-if="user" :items :popper="{ placement: 'bottom-start' }">
          <UButton
            color="gray"
            :label="user.email"
            trailing-icon="i-heroicons-chevron-down-20-solid"
          />
        </UDropdown>
        <UButton v-else to="/login" color="gray">Login</UButton>
        <ColorMode />
      </div>
    </UContainer>
  </nav>
</template>

<script setup lang="ts">
import type { DropdownItem } from '#ui/types'

const user = useSupabaseUser()

const items: DropdownItem[][] = [
  [
    {
      label: 'Account',
      to: '/account',
      icon: 'i-heroicons-user-20-solid',
    },
  ],
  [
    {
      label: 'Log out',
      icon: 'i-heroicons-arrow-left-start-on-rectangle-20-solid',
      click: logout,
    },
  ],
]

async function logout() {
  await useSupabaseClient().auth.signOut()
}

onMounted(() => {
  const route = useRoute()
  const router = useRouter()

  if (route.query.error && route.query.error_description) {
    useToast().add({
      color: 'red',
      icon: 'i-heroicons-exclamation-circle-20-solid',
      title: route.query.error_description as string,
    })

    router.replace({ query: {} })
  }
})
</script>
