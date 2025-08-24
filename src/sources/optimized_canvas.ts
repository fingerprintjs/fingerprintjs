import { Component } from '../utils/entropy_source'

/**
 * Оптимизированная версия canvas fingerprinting с улучшенной производительностью
 */
export default function getOptimizedCanvasFingerprint(): Component<string> {
  const startTime = Date.now()
  
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      return { error: new Error('Canvas context not available'), duration: Date.now() - startTime }
    }
    
    // Оптимизированные настройки canvas для лучшей производительности
    canvas.width = 200
    canvas.height = 200
    
    // Используем более эффективные операции рисования
    ctx.fillStyle = '#f60'
    ctx.fillRect(0, 0, 100, 100)
    
    ctx.fillStyle = '#069'
    ctx.fillRect(100, 0, 100, 100)
    
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
    ctx.fillRect(0, 100, 100, 100)
    
    // Добавляем текст с оптимизированными настройками
    ctx.fillStyle = '#000'
    ctx.font = '16px Arial'
    ctx.fillText('FingerprintJS', 10, 50)
    
    // Добавляем градиент для увеличения энтропии
    const gradient = ctx.createLinearGradient(0, 0, 200, 200)
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)')
    gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.5)')
    gradient.addColorStop(1, 'rgba(0, 0, 255, 0.5)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(50, 50, 100, 100)
    
    // Добавляем кривые Безье для уникальности
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(20, 150)
    ctx.bezierCurveTo(50, 120, 80, 180, 110, 150)
    ctx.stroke()
    
    // Добавляем тени для увеличения энтропии
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 5
    ctx.shadowOffsetY = 5
    
    ctx.fillStyle = '#fff'
    ctx.fillRect(150, 150, 40, 40)
    
    // Сбрасываем тени
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    
    // Добавляем паттерны для уникальности
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = `hsl(${i * 36}, 70%, 50%)`
      ctx.fillRect(i * 20, 180, 15, 15)
    }
    
    // Получаем data URL с оптимизированным качеством
    const dataURL = canvas.toDataURL('image/png', 0.8)
    
    return {
      value: dataURL,
      duration: Date.now() - startTime
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Canvas fingerprinting failed'),
      duration: Date.now() - startTime
    }
  }
}

/**
 * Альтернативная версия canvas fingerprinting с WebGL
 */
export function getWebGLCanvasFingerprint(): Component<string> {
  const startTime = Date.now()
  
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) {
      return { error: new Error('WebGL context not available'), duration: Date.now() - startTime }
    }
    
    canvas.width = 256
    canvas.height = 256
    
    // Создаем простую WebGL сцену для fingerprinting
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    if (vertexShader) {
      gl.shaderSource(vertexShader, `
        attribute vec2 a_position;
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `)
      gl.compileShader(vertexShader)
    }
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    if (fragmentShader) {
      gl.shaderSource(fragmentShader, `
        precision mediump float;
        uniform float u_time;
        void main() {
          gl_FragColor = vec4(sin(u_time), cos(u_time), 0.5, 1.0);
        }
      `)
      gl.compileShader(fragmentShader)
    }
    
    const program = gl.createProgram()
    if (program && vertexShader && fragmentShader) {
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)
      gl.useProgram(program)
    }
    
    // Рисуем простую геометрию
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    // Получаем WebGL параметры для fingerprinting
    const parameters = [
      gl.ALIASED_LINE_WIDTH_RANGE,
      gl.ALIASED_POINT_SIZE_RANGE,
      gl.ALPHA_BITS,
      gl.ANTIALIASED,
      gl.BLUE_BITS,
      gl.CULL_FACE,
      gl.DEPTH_BITS,
      gl.DEPTH_CLEAR_VALUE,
      gl.DEPTH_FUNC,
      gl.DEPTH_RANGE,
      gl.DEPTH_TEST,
      gl.DEPTH_WRITEMASK,
      gl.DITHER,
      gl.FRONT_FACE,
      gl.GENERATE_MIPMAP_HINT,
      gl.GREEN_BITS,
      gl.LINE_WIDTH,
      gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS,
      gl.MAX_CUBE_MAP_TEXTURE_SIZE,
      gl.MAX_FRAGMENT_UNIFORM_VECTORS,
      gl.MAX_RENDERBUFFER_SIZE,
      gl.MAX_TEXTURE_IMAGE_UNITS,
      gl.MAX_TEXTURE_SIZE,
      gl.MAX_VARYING_VECTORS,
      gl.MAX_VERTEX_ATTRIBS,
      gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS,
      gl.MAX_VERTEX_UNIFORM_VECTORS,
      gl.MAX_VIEWPORT_DIMS,
      gl.PACK_ALIGNMENT,
      gl.POLYGON_OFFSET_FACTOR,
      gl.POLYGON_OFFSET_FILL,
      gl.POLYGON_OFFSET_UNITS,
      gl.RED_BITS,
      gl.RENDERER,
      gl.SAMPLE_BUFFERS,
      gl.SAMPLES,
      gl.SCISSOR_BOX,
      gl.SCISSOR_TEST,
      gl.STENCIL_BACK_FAIL,
      gl.STENCIL_BACK_FUNC,
      gl.STENCIL_BACK_PASS_DEPTH_FAIL,
      gl.STENCIL_BACK_PASS_DEPTH_PASS,
      gl.STENCIL_BACK_REF,
      gl.STENCIL_BACK_VALUE_MASK,
      gl.STENCIL_BACK_WRITEMASK,
      gl.STENCIL_BITS,
      gl.STENCIL_CLEAR_VALUE,
      gl.STENCIL_FAIL,
      gl.STENCIL_FUNC,
      gl.STENCIL_PASS_DEPTH_FAIL,
      gl.STENCIL_PASS_DEPTH_PASS,
      gl.STENCIL_REF,
      gl.STENCIL_TEST,
      gl.STENCIL_VALUE_MASK,
      gl.STENCIL_WRITEMASK,
      gl.SUBPIXEL_BITS,
      gl.TEXTURE_BINDING_2D,
      gl.TEXTURE_BINDING_CUBE_MAP,
      gl.UNPACK_ALIGNMENT,
      gl.VENDOR,
      gl.VERSION,
      gl.VIEWPORT
    ]
    
    const fingerprint = parameters.map(param => {
      try {
        return gl.getParameter(param)
      } catch (e) {
        return null
      }
    }).join('~')
    
    return {
      value: fingerprint,
      duration: Date.now() - startTime
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('WebGL canvas fingerprinting failed'),
      duration: Date.now() - startTime
    }
  }
}