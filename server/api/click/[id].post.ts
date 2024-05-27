import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '@/types/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const client = serverSupabaseServiceRole<Database>(event)

  return await client.from('clicks').insert({
    link: Number(id),
  })
})
