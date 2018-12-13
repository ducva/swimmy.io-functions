import * as config from '../../service-account.json'

export const getConfig = (projectId?: string): any => {
  const id = process.env.GCLOUD_PROJECT || projectId

  if (!id) {
    throw new Error('projectId not found')
  }

  return (config as any)[id]
}
