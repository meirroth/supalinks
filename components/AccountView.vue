<template>
  <div class="space-y-4">
    <h1 class="text-center text-lg font-semibold">Account</h1>
    <ul>
      <li v-if="user">ID: {{ user.id.split('-')[0] }}</li>
      <li v-if="user">Email: {{ user.email }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
</script>
