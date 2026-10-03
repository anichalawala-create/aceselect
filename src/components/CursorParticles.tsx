"use client";

import React, { useEffect, useRef } from 'react';

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  life: number;
  maxLife: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    // Random size between 1 and 5
    this.size = Math.random() * 4 + 1;
    // Random velocity
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    
    // Choose between white and brand colors
    const colors = [
      'rgba(255, 255, 255, 0.8)',   // White
      'rgba(184, 126, 248, 0.8)',   // solvorry-light (Purple)
      'rgba(45, 27, 84, 0.8)',      // solvorry-dark (Deep Navy)
      'rgba(27, 129, 248, 0.8)',    // A bright blue
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    
    // Lifespan logic
    this.maxLife = Math.random() * 40 + 20; // 20 to 60 frames
    this.life = this.maxLife;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Simulate slight gravity floating upwards
    this.speedY -= 0.05; 
    
    // Shrink over time
    if (this.size > 0.2) this.size -= 0.1;
    this.life--;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesArray = useRef<Particle[]>([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const animationFrameId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      // Get the parent container's dimensions
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to canvas
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      // Spawn new particles on move
      for (let i = 0; i < 3; i++) {
        particlesArray.current.push(new Particle(mouse.current.x, mouse.current.y));
      }
    };

    // Listen on the window or parent to catch all movements over the hero section
    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.current.length; i++) {
        particlesArray.current[i].update();
        particlesArray.current[i].draw(ctx);
        
        // Remove dead particles
        if (particlesArray.current[i].life <= 0) {
          particlesArray.current.splice(i, 1);
          i--;
        }
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full"
      style={{ zIndex: 1 }} // Ensure it's above background but behind content
    />
  );
}
