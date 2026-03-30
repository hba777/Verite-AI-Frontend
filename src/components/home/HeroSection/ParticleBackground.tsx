// src/components/home/ParticleBackground.tsx

import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // --- Configuration ---
    const particleCount = 200; 
    const speed = 3; 
    const colors = ['#3b6bff', '#e11d48', '#fbbf24', '#4f46e5', '#ffffff']; 
    
    // --- Mouse Tracking Variables ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0; // Used for smooth easing
    let targetY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Track mouse movement relative to the center of the screen
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX - window.innerWidth / 2;
      mouseY = e.clientY - window.innerHeight / 2;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    class Particle {
      x: number;
      y: number;
      z: number;
      color: string;

      constructor() {
        this.x = (Math.random() - 0.5) * canvas!.width * 2;
        this.y = (Math.random() - 0.5) * canvas!.height * 2;
        this.z = Math.random() * canvas!.width;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.z -= speed;
        // Reset particle to the back when it passes the camera
        if (this.z <= 0) {
          this.z = canvas!.width;
          this.x = (Math.random() - 0.5) * canvas!.width * 2;
          this.y = (Math.random() - 0.5) * canvas!.height * 2;
        }
      }

      draw() {
        const fov = 350; 
        
        // Offset the center based on smoothed mouse position
        // Multiply by 0.5 to control how intensely the particles follow the mouse
        const centerX = canvas!.width / 2 - targetX * 0.5;
        const centerY = canvas!.height / 2 - targetY * 0.5;

        // Map 3D coordinates to 2D canvas with the new shifting center
        const sx = (this.x / this.z) * fov + centerX;
        const sy = (this.y / this.z) * fov + centerY;

        const pz = this.z + speed * 2; 
        const px = (this.x / pz) * fov + centerX;
        const py = (this.y / pz) * fov + centerY;

        if (ctx) {
          ctx.strokeStyle = this.color;
          ctx.lineWidth = Math.max(0.5, (1 - this.z / canvas!.width) * 3);
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }
      }
    }

    let particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smoothly ease the target coordinates towards the actual mouse coordinates
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none opacity-80" 
    />
  );
};

export default ParticleBackground;