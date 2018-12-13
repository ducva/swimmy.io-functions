import { CallableContext } from 'firebase-functions/lib/providers/https'
import { log } from './logger'

export const getUserId = (context: CallableContext): string | null => {
  log(__filename, 'context.auth', context.auth)

  return context.auth ? context.auth.uid : null
}
