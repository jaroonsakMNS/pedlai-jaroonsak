export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  priority: TaskPriority
  done: boolean
  createdAt: number
}

export type TaskFilter = 'all' | 'active' | 'done'
