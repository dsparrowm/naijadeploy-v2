"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshTransmissionMaterial, Environment } from "@react-three/drei"
import { useRef, useMemo } from "react"
import * as THREE from "three"

function FloatingCube({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={0.1}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.5}
          temporalDistortion={0.1}
          metalness={0.1}
          roughness={0.1}
          envMapIntensity={1}
          color="#22c55e"
          transmission={0.95}
        />
      </mesh>
    </Float>
  )
}

function FloatingSphere({ position, scale }: { position: [number, number, number]; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.3
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.8}
          chromaticAberration={0.15}
          anisotropy={0.2}
          distortion={0.3}
          distortionScale={0.3}
          temporalDistortion={0.05}
          metalness={0.05}
          roughness={0.05}
          envMapIntensity={1.5}
          color="#16a34a"
          transmission={0.9}
        />
      </mesh>
    </Float>
  )
}

function FloatingTorus({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed
      meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.5
    }
  })

  return (
    <Float speed={2.5} rotationIntensity={1} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.4, 16, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.6}
          chromaticAberration={0.2}
          anisotropy={0.4}
          distortion={0.15}
          distortionScale={0.4}
          temporalDistortion={0.08}
          metalness={0.1}
          roughness={0.08}
          envMapIntensity={1.2}
          color="#15803d"
          transmission={0.92}
        />
      </mesh>
    </Float>
  )
}

function FloatingOctahedron({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * speed
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[1]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.7}
          chromaticAberration={0.12}
          anisotropy={0.35}
          distortion={0.25}
          distortionScale={0.35}
          temporalDistortion={0.06}
          metalness={0.08}
          roughness={0.06}
          envMapIntensity={1.3}
          color="#4ade80"
          transmission={0.93}
        />
      </mesh>
    </Float>
  )
}

function Particles() {
  const count = 200
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 20
      const scale = Math.random() * 0.05 + 0.02
      temp.push({ x, y, z, scale })
    }
    return temp
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      const matrix = new THREE.Matrix4()
      for (let i = 0; i < count; i++) {
        const particle = particles[i]
        const y = particle.y + Math.sin(state.clock.elapsedTime + i * 0.1) * 0.02
        matrix.setPosition(particle.x, y, particle.z)
        matrix.scale(new THREE.Vector3(particle.scale, particle.scale, particle.scale))
        meshRef.current.setMatrixAt(i, matrix)
      }
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#22c55e" transparent opacity={0.6} />
    </instancedMesh>
  )
}

function Scene() {
  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#22c55e" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#16a34a" />

      {/* Main floating shapes */}
      <FloatingCube position={[-3, 1, -2]} scale={1.2} speed={0.3} />
      <FloatingCube position={[3.5, -0.5, -3]} scale={0.8} speed={0.4} />
      <FloatingSphere position={[2, 1.5, -1]} scale={0.9} />
      <FloatingSphere position={[-2.5, -1.5, -2]} scale={0.6} />
      <FloatingTorus position={[0, -1, -4]} scale={0.7} speed={0.25} />
      <FloatingTorus position={[-4, 0.5, -3]} scale={0.5} speed={0.35} />
      <FloatingOctahedron position={[4, 0, -2]} scale={0.65} speed={0.3} />
      <FloatingOctahedron position={[-1, 2, -3]} scale={0.45} speed={0.4} />

      {/* Background particles */}
      <Particles />
    </>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
