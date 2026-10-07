'use client'

import type { ModelFile } from '@/types/model'
import styles from './Sidebar.module.css'

type SidebarProps = {
  models: ModelFile[]
  selectedModelUrl: string | null
  hidden: boolean
  onSelectModel: (url: string) => void
  onToggleVisibility: () => void
}

export default function Sidebar({
  models,
  selectedModelUrl,
  hidden,
  onSelectModel,
  onToggleVisibility,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div>
        <p className={styles.eyebrow}>THREE.JS VIEWER</p>
        <h1 className={styles.title}>Models</h1>
      </div>

      <div className={styles.modelList}>
        {models.length > 0 ? (
          models.map((model) => (
            <button
              className={`${styles.modelButton} ${
                selectedModelUrl === model.url ? styles.active : ''
              }`}
              key={model.url}
              onClick={() => onSelectModel(model.url)}
              type="button"
            >
              {model.name}
            </button>
          ))
        ) : (
          <p className={styles.empty}>Không tìm thấy file GLB trong public/models.</p>
        )}
      </div>

      <button
        className={styles.visibilityButton}
        disabled={!selectedModelUrl}
        onClick={onToggleVisibility}
        type="button"
      >
        {hidden ? 'Show model' : 'Hide model'}
      </button>
    </aside>
  )
}
