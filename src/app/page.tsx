import { readdir } from 'node:fs/promises'
import path from 'node:path'
import ModelViewer from '@/components/ModelViewer'
import type { ModelFile } from '@/types/model'
import styles from './page.module.css'

export default async function Home() {
  const models = await getModels()
  
  return (
    <main className={styles.main}>
      <ModelViewer models={models} />
    </main>
  )
}

async function getModels(): Promise<ModelFile[]> {
  const modelsDirectory = path.join(process.cwd(), 'public', 'models')
  const entries = await readdir(modelsDirectory, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isFile() && /\.(glb|gltf)$/i.test(entry.name))
    .map((entry) => ({
      name: formatModelName(entry.name),
      url: `/models/${encodeURIComponent(entry.name)}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function formatModelName(fileName: string) {
  return fileName
    .replace(/\.(glb|gltf)$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
