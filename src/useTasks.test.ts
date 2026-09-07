import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useTasks } from './useTasks'

describe('useTasks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts empty', () => {
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toHaveLength(0)
    expect(result.current.stats).toEqual({ total: 0, done: 0, active: 0 })
  })

  it('adds a task and updates stats', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.addTask('Ship the environment', 'high'))
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0]).toMatchObject({
      title: 'Ship the environment',
      priority: 'high',
      done: false,
    })
    expect(result.current.stats).toEqual({ total: 1, done: 0, active: 1 })
  })

  it('ignores blank titles', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.addTask('   ', 'low'))
    expect(result.current.tasks).toHaveLength(0)
  })

  it('toggles completion and filters', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.addTask('First', 'medium'))
    const id = result.current.tasks[0].id

    act(() => result.current.toggleTask(id))
    expect(result.current.tasks[0].done).toBe(true)
    expect(result.current.stats).toEqual({ total: 1, done: 1, active: 0 })

    act(() => result.current.setFilter('active'))
    expect(result.current.visibleTasks).toHaveLength(0)

    act(() => result.current.setFilter('done'))
    expect(result.current.visibleTasks).toHaveLength(1)
  })

  it('removes and clears completed tasks', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.addTask('Keep', 'low'))
    act(() => result.current.addTask('Drop', 'high'))
    const dropId = result.current.tasks[0].id

    act(() => result.current.removeTask(dropId))
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe('Keep')

    act(() => result.current.toggleTask(result.current.tasks[0].id))
    act(() => result.current.clearCompleted())
    expect(result.current.tasks).toHaveLength(0)
  })

  it('persists tasks to localStorage', () => {
    const { result, unmount } = renderHook(() => useTasks())
    act(() => result.current.addTask('Persisted', 'medium'))
    unmount()

    const { result: reloaded } = renderHook(() => useTasks())
    expect(reloaded.current.tasks).toHaveLength(1)
    expect(reloaded.current.tasks[0].title).toBe('Persisted')
  })
})
