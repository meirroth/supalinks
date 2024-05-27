<template>
  <div class="space-y-3">
    <div class="flex justify-between">
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

      <UInput
        v-model="q"
        placeholder="Filter links..."
        icon="i-heroicons-magnifying-glass-20-solid"
      />
    </div>

    <UTable v-if="filteredRows" :columns :rows="filteredRows">
      <template #from-data="{ row }">
        <UInput
          v-if="editing && editing.id === row.id"
          v-model="editing.from"
          type="text"
          required
        />
        <NuxtLink
          v-else
          :to="`/${row.from}`"
          target="_blank"
          class="text-primary underline"
        >
          /{{ row.from }}
        </NuxtLink>
      </template>
      <template #to-data="{ row }">
        <UInput
          v-if="editing && editing.id === row.id"
          v-model="editing.to"
          type="url"
          required
        />
        <NuxtLink
          v-else
          :to="row.to"
          external
          target="_blank"
          class="text-primary underline"
        >
          {{ row.to }}
        </NuxtLink>
      </template>
      <template #actions-data="{ row }">
        <div class="flex justify-end space-x-2">
          <template v-if="editing && editing.id === row.id">
            <UButton color="gray" variant="ghost" @click="doneEditing">
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="updating.includes(row.id)"
              @click="updateLink(editing)"
            >
              Save
            </UButton>
          </template>
          <template v-else>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-trash-20-solid"
              @click="deleteLink(row)"
            />
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-pencil-square-20-solid"
              @click="editLink(row)"
            />
          </template>
        </div>
      </template>
    </UTable>

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

const editing = ref<Link | null>(null)
const updating = ref<number[]>([])
const deleting = ref<number[]>([])

const { data, refresh, clear, status } = useAsyncData(async () => getLinks())

const columns = [
  { key: 'from', label: 'From' },
  { key: 'to', label: 'To' },
  { key: 'created_at', label: 'Created' },
  { key: 'actions' },
]

const rows = computed(() => {
  return data.value?.map((link) => ({
    ...link,
    created_at: formatDate(link.created_at),
  }))
})

const q = ref('')

const filteredRows = computed(() => {
  if (!q.value) {
    return rows.value
  }

  return rows.value?.filter((row) => {
    return Object.values(row).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})

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
  if (!isLinkValid(from.value, to.value)) {
    return
  }

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

function editLink(link: Link) {
  editing.value = { ...link }
}

function doneEditing() {
  editing.value = null
}

async function updateLink(link: Link) {
  if (!isLinkValid(link.from, link.to)) {
    return
  }

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
  doneEditing()
}

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

function isLinkValid(from: string, to: string): boolean {
  let error = ''
  if (!from) {
    error = 'From is required'
  } else if (!to) {
    error = 'To is required'
  } else if (!/^[a-zA-Z0-9-]+$/.test(from)) {
    error = 'From can only contain letters, numbers, and dashes'
  } else if (!/^https?:\/\/.+\..+/.test(to)) {
    error = 'To must be a valid URL'
  }
  if (error) {
    toast.add({
      color: 'red',
      icon: 'i-heroicons-exclamation-circle-20-solid',
      title: error,
    })
  }
  return !error
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
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
