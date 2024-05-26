<template>
  <div class="space-y-3">
    <form class="flex space-x-2" @submit.prevent="createLink">
      <UInput
        v-model="from"
        type="text"
        placeholder="From"
        required
        autofocus
      />
      <UInput v-model="to" type="url" placeholder="To" required />
      <UButton type="submit">Create</UButton>
    </form>

    <UTable v-if="data" :rows="data" />

    <div v-else>
      <span v-if="!user">
        <NuxtLink to="/login" class="text-primary underline">Login</NuxtLink> to
        add links.
      </span>
      <span v-else-if="status === 'pending'">Loading links...</span>
      <span v-else-if="status === 'success'">No links yet. Create one!</span>
      <span v-else>
        Couldn't fetch links.
        <UButton color="white" variant="ghost" @click="refresh">Retry</UButton>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database, Tables } from '@/types/supabase'

type Link = Tables<'links'>

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()
const toast = useToast()

const from = ref('')
const to = ref('')

const updating = ref<number[]>([])
const deleting = ref<number[]>([])

const { data, refresh, clear, status } = useAsyncData(async () => getLinks())

watch(user, () => {
  if (!user.value) {
    clear()
  }
})

async function getLinks() {
  if (!user.value) return
  try {
    const { data, error } = await client
      .from('links')
      .select('*')
      .eq('user', user.value.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error: any) {
    toast.add({
      color: 'red',
      icon: 'i-heroicons-exclamation-circle-20-solid',
      title: 'Couldn’t fetch links',
      description: error.message,
    })
  }
}

async function createLink() {
  if (!from.value || !to.value) return
  try {
    const { error } = await client
      .from('links')
      .insert({ from: from.value, to: to.value })

    if (error) {
      throw new Error(error.message)
    }

    from.value = ''
    to.value = ''
    refresh()
  } catch (error: any) {
    toast.add({
      color: 'red',
      icon: 'i-heroicons-exclamation-circle-20-solid',
      title: 'Couldn’t create link',
      description: error.message,
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function updateLink(link: Link) {
  updating.value.push(link.id)

  try {
    const { error } = await client
      .from('links')
      .update({ from: link.from, to: link.to })
      .eq('id', link.id)

    if (error) {
      throw new Error(error.message)
    }

    await refresh()
  } catch (error: any) {
    toast.add({
      color: 'red',
      icon: 'i-heroicons-exclamation-circle-20-solid',
      title: 'Couldn’t update link',
      description: error.message,
    })
  }

  updating.value = updating.value.filter((id) => id !== link.id)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function deleteLink(link: Link) {
  deleting.value.push(link.id)

  try {
    const { error } = await client.from('links').delete().eq('id', link.id)

    if (error) {
      throw new Error(error.message)
    }

    await refresh()
  } catch (error: any) {
    toast.add({
      color: 'red',
      icon: 'i-heroicons-exclamation-circle-20-solid',
      title: 'Couldn’t delete link',
      description: error.message,
    })
  }

  deleting.value = deleting.value.filter((id) => id !== link.id)
}
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  @apply transition-all duration-200 ease-in-out;
}

.list-enter-from,
.list-leave-to {
  @apply translate-x-8 opacity-0;
}

.list-leave-active {
  @apply absolute;
}
</style>
