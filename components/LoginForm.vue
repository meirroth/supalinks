<template>
  <div class="space-y-4 text-center">
    <h1 class="text-lg font-semibold">Login or Sign up</h1>
    <UButtonGroup v-if="!sent" class="w-full">
      <UInput
        v-model="email"
        class="w-full"
        type="email"
        placeholder="hello@email.com"
        autofocus
        required
        :disabled="sending || sent"
        @keyup.enter="login"
      />
      <UButton :disabled="!email || sent" :loading="sending" @click="login">
        Submit
      </UButton>
    </UButtonGroup>
    <p class="text-sm opacity-60">
      <span v-if="sent">Email sent! Check your inbox.</span>
      <span v-else>We'll send you a magic link to login or sign up.</span>
    </p>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()

const email = ref('')
const sending = ref(false)
const sent = ref(false)

async function login() {
  sending.value = true
  try {
    if (!email.value || !email.value.includes('@')) {
      throw new Error('Please enter a valid email address.')
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: { emailRedirectTo: window.location.origin + '/confirm' },
    })

    if (error) {
      throw error
    }

    email.value = ''
    sent.value = true
  } catch (error: any) {
    useToast().add({
      color: 'red',
      icon: 'i-heroicons-exclamation-circle-20-solid',
      title: error.message,
    })
  }
  sending.value = false
}
</script>
