import assert from 'assert'

export const createArrayInArray = <T>(array: T[], limit = 500): T[][] => {
  assert(array)
  assert(limit)

  const task: any[] = []

  array.forEach((b, index) => {
    const n = parseInt((index / limit).toString())
    if (!task[n]) {
      task[n] = []
    }
    task[n].push(b)
  })

  return task
}
