'use client'

import { useEffect, useState } from 'react'
import type { ModelFile } from '@/types/model'
import Sidebar from './Sidebar'
import ThreeScene from './ThreeScene'

type ModelViewerProps = {
  models: ModelFile[]
}

export default function ModelViewer({ models }: ModelViewerProps) {
  const [selectedModelUrl, setSelectedModelUrl] = useState<string>(
    models[0]?.url,
  )
  const [hiddenModels, setHiddenModels] = useState<Set<string>>(new Set<string>())
  const selectModel = (url: string) => {
    setSelectedModelUrl(url)
  }
  const toggleVisibility = (url: string) => {
    setHiddenModels((current) => {
      const next = new Set<string>(current);
      if (next.has(url)) {
        next.delete(url)
      }
      else
        next.add(url);
      return next;
    })
  }
  useEffect(() => {
    console.log(hiddenModels)
  }, [hiddenModels]);

  return (
    <>
      <Sidebar
        models={models}
        selectedModelUrl={selectedModelUrl}
        hidden={hiddenModels.has(selectedModelUrl)}
        onSelectModel={selectModel}
        onToggleVisibility={() => toggleVisibility(selectedModelUrl)}
      />
      <ThreeScene modelUrl={selectedModelUrl} hidden={hiddenModels.has(selectedModelUrl)} />
    </>
  )
}
