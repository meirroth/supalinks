import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '@/types/supabase'

export default defineCachedEventHandler(async (event) => {
  const from = getRouterParam(event, 'from')
  const client = serverSupabaseServiceRole<Database>(event)

  if (!from) {
    return null
  }

  const { data } = await client
    .from('links')
    .select('*')
    .eq('from', from)
    .maybeSingle()

  return data
})
