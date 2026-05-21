"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBrain() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Brain (Wireframe)
    const geometry = new THREE.IcosahedronGeometry(2, 4);
    const material = new THREE.MeshStandardMaterial({
      color: 0x7C3AED,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const brain = new THREE.Mesh(geometry, material);
    scene.add(brain);

    // Inner Sphere (Solid)
    const innerGeometry = new THREE.IcosahedronGeometry(1.8, 3);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x4C1D95,
      transparent: true,
      opacity: 0.15,
      flatShading: true,
    });
    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerSphere);

    // Lights
    const purpleLight = new THREE.PointLight(0x7C3AED, 50);
    purpleLight.position.set(2, 2, 2);
    scene.add(purpleLight);

    const redLight = new THREE.PointLight(0xEF4444, 50);
    redLight.position.set(-2, -1, -2);
    scene.add(redLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      brain.rotation.y += 0.001;
      innerSphere.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
