'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

type ThreeSceneProps = {
  modelUrl: string | null
  hidden: boolean
}

export default function ThreeScene({ modelUrl, hidden }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<THREE.Object3D | null>(null)
  const hiddenRef = useRef(hidden)

  useEffect(() => {
    hiddenRef.current = hidden
    if (modelRef.current) modelRef.current.visible = !hidden
  }, [hidden])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x080b12)

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 0, 4)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06

    const keyLight = new THREE.DirectionalLight(0xffffff, 4)
    keyLight.position.set(3, 4, 5)
    scene.add(keyLight, new THREE.AmbientLight(0x94a3b8, 1.5))

    let disposed = false
    let animationFrame = 0

    if (modelUrl) {
      new GLTFLoader().load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene

          if (disposed) {
            disposeObject(model)
            return
          }

          const box = new THREE.Box3().setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          model.position.sub(center)

          const centeredBox = new THREE.Box3().setFromObject(model)
          const sphere = centeredBox.getBoundingSphere(new THREE.Sphere())
          const radius = Math.max(sphere.radius, 0.1)
          const distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))

          camera.position.set(0, radius * 0.15, distance * 1.15)
          camera.near = Math.max(distance / 100, 0.01)
          camera.far = distance * 100
          camera.updateProjectionMatrix()

          controls.target.set(0, 0, 0)
          controls.minDistance = radius * 0.5
          controls.maxDistance = distance * 4
          controls.update()

          model.visible = !hiddenRef.current
          modelRef.current = model
          scene.add(model)
        },
        undefined,
        (error) => console.error(`Cannot load model: ${modelUrl}`, error),
      )
    }

    const animate = () => {
      controls.update()
      renderer.render(scene, camera)
      animationFrame = window.requestAnimationFrame(animate)
    }

    const handleResize = () => {
      const { clientWidth, clientHeight } = container
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
    }

    window.addEventListener('resize', handleResize)
    animate()

    return () => {
      disposed = true
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', handleResize)
      controls.dispose()

      if (modelRef.current) {
        scene.remove(modelRef.current)
        disposeObject(modelRef.current)
        modelRef.current = null
      }

      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [modelUrl])

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return

    child.geometry.dispose()
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.forEach((material) => material.dispose())
  })
}
