<script>
  import { spring } from 'svelte/motion'
  import { onMount, afterUpdate } from 'svelte'
  import paper from 'paper'

  let coords = spring({ x: -100, y: -100 }, {
    stiffness: 0.1,
    damping: 0.4
  })
  const handleMouseMove = (e) => coords.set({ x: e.clientX, y: e.clientY })
  export let color = '#fefefe'
  export let type = 'dot'
  let canvas
  let group
  let lastX = 0
  let lastY = 0

  const setupRing = () => {
    if (type !== 'ring') {
      canvas && canvas.remove()
      return;
    }
    canvas = document.createElement('canvas')
    canvas.classList.add('cursor-canvas')
    canvas.setAttribute('resize', true)
    document.querySelector('.cursor-wrapper').appendChild(canvas)
    const shapeBounds = {
      width: 75,
      height: 75
    }
    paper.setup(canvas)
    const strokeColor = color
    const strokeWidth = 1
    const segments = 8
    const radius = 15

    // the base shape for the noisy circle
    const polygon = new paper.Path.RegularPolygon(
      new paper.Point(0, 0),
      segments,
      radius
    )
    polygon.strokeColor = strokeColor
    polygon.strokeWidth = strokeWidth
    polygon.smooth()
    group = new paper.Group([polygon])
    group.applyMatrix = false

    // function for linear interpolation of values
    const lerp = (a, b, n) => {
      return (1 - n) * a + n * b
    }
    
    // function to map a value from one range to another range
    const map = (value, in_min, in_max, out_min, out_max) => {
      return (
        ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
      )
    }
    paper.view.onFrame = event => {
      // using linear interpolation, the circle will move 0.2 (20%)
      // of the distance between its current position and the mouse
      // coordinates per Frame
      lastX = lerp(lastX, $coords.x, 0.2);
      lastY = lerp(lastY, $coords.y, 0.2);
      group.position = new paper.Point(lastX, lastY);
      polygon.strokeColor = color
    }
  }
  $: if (type) {
    setupRing()
  }
  onMount(setupRing)
</script>

<svelte:body
  on:mousemove={handleMouseMove}
/>

<div class="cursor-wrapper">
  <div 
    class="custom-cursor" 
    class:custom-cursor-dot="{type === 'dot' || type === 'ring'}"
    class:custom-cursor-spot="{type === 'spot'}"
    style="transform: translate({$coords.x}px, {$coords.y}px); border: 1px solid {color}; background: {color};">
    <div class="custom-cursor custom-cursor__inner"></div>
  </div>
  
</div>

<style type="text/scss">
:global(*) {
  cursor: none !important;
}
:global(body) {
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
}
.cursor-wrapper {
  position: fixed;
  opacity: 1;
  width: 100px;
  height: 100px;
  left: -50px;
  top: -50px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1600000;
  pointer-events: none;
  // &.has-blend-mode {
  //   mix-blend-mode: exclusion;
  // }
}

.custom-cursor {
  position: relative;
  left: 0;
  top: 0;
  transition: width .3s linear;
  transition: height .3s linear;

  &-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }

  &-spot {
    width: 30px;
    height: 30px;
    opacity: .7;
    border-radius: 50%;
  }

  &__inner {
    position: relative;
    width: 100%;
    height: 100%;
    &:before,
    &:after {
      content: "";
      position: absolute;
      width: 40%;
      height: 1px;
      background: transparent;
      transition: transform 0.1s linear;
    }
    &:before {
      left: 50%;
      top: 50%;
      transform: translateX(-50%);
    }
    &:after {
      left: 50%;
      top: 50%;
      transform: translateX(-50%) rotate(-90deg);
    }
    &.is-closing:after {
      transform: translateX(-50%) rotate(0deg);
    }
  }
}
:global(.cursor-canvas) {
  position: fixed;
  left: 0;
  top: 0;
  pointer-events: none;
  width: 100vw;
  height: 100vh;
  z-index: 12000;
}
</style>