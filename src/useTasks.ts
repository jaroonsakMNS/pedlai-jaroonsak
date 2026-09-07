import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Task, TaskFilter, TaskPriority } from './types'

const STORAGE_KEY = 'pedlai.tasks.v1'

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Task[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())
  const [filter, setFilter] = useState<TaskFilter>('all')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // Ignore write errors (e.g. private mode / quota).
    }
  }, [tasks])

  const addTask = useCallback((title: string, priority: TaskPriority) => {
    const trimmed = title.trim()
    if (!trimmed) return
    setTasks((prev) => [
      {
        id: createId(),
        title: trimmed,
        priority,
        done: false,
        createdAt: Date.now(),
      },
      ...prev,
    ])
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    )
  }, [])

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !task.done))
  }, [])

  const visibleTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter((task) => !task.done)
      case 'done':
        return tasks.filter((task) => task.done)
      default:
        return tasks
    }
  }, [tasks, filter])

  const stats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((task) => task.done).length
    return { total, done, active: total - done }
  }, [tasks])

  return {
    tasks,
    visibleTasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    removeTask,
    clearCompleted,
    stats,
  }
}
