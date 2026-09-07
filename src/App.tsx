import { useState } from 'react'
import './App.css'
import { useTasks } from './useTasks'
import type { TaskFilter, TaskPriority } from './types'

const FILTERS: { label: string; value: TaskFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Done', value: 'done' },
]

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high']

function App() {
  const {
    visibleTasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    removeTask,
    clearCompleted,
    stats,
  } = useTasks()

  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    addTask(title, priority)
    setTitle('')
    setPriority('medium')
  }

  const progress = stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100)

  return (
    <div className="app">
      <header className="app__header">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            P
          </span>
          <div>
            <h1 className="brand__name">Pedlai</h1>
            <p className="brand__tagline">A focused board for the work that matters.</p>
          </div>
        </div>
        <div className="stats" aria-live="polite">
          <div className="stats__item">
            <span className="stats__value">{stats.active}</span>
            <span className="stats__label">Active</span>
          </div>
          <div className="stats__item">
            <span className="stats__value">{stats.done}</span>
            <span className="stats__label">Done</span>
          </div>
          <div className="stats__item">
            <span className="stats__value">{progress}%</span>
            <span className="stats__label">Complete</span>
          </div>
        </div>
      </header>

      <main className="board">
        <form className="composer" onSubmit={handleSubmit}>
          <input
            className="composer__input"
            type="text"
            placeholder="What needs to get done?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-label="Task title"
          />
          <select
            className="composer__priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
            aria-label="Task priority"
          >
            {PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {value[0].toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
          <button className="composer__add" type="submit" disabled={!title.trim()}>
            Add task
          </button>
        </form>

        <div className="toolbar">
          <div className="filters" role="tablist" aria-label="Filter tasks">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                role="tab"
                aria-selected={filter === item.value}
                className={`filters__btn ${filter === item.value ? 'is-active' : ''}`}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            className="toolbar__clear"
            onClick={clearCompleted}
            disabled={stats.done === 0}
          >
            Clear completed
          </button>
        </div>

        <ul className="tasks">
          {visibleTasks.length === 0 ? (
            <li className="empty">
              <p className="empty__title">Nothing here yet</p>
              <p className="empty__hint">Add your first task to get rolling.</p>
            </li>
          ) : (
            visibleTasks.map((task) => (
              <li
                key={task.id}
                className={`task ${task.done ? 'is-done' : ''}`}
                data-priority={task.priority}
              >
                <label className="task__main">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    aria-label={`Mark "${task.title}" as ${task.done ? 'active' : 'done'}`}
                  />
                  <span className="task__title">{task.title}</span>
                </label>
                <span className={`badge badge--${task.priority}`}>{task.priority}</span>
                <button
                  className="task__delete"
                  onClick={() => removeTask(task.id)}
                  aria-label={`Delete "${task.title}"`}
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>
      </main>

      <footer className="app__footer">
        <span>
          {stats.total} {stats.total === 1 ? 'task' : 'tasks'} · stored locally in your browser
        </span>
      </footer>
    </div>
  )
}

export default App
