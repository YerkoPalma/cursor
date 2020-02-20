<script context="module">
  let wrapper

  export function simpleCursorFactory (classes, replace = false) {
    if (typeof classes === 'string') {
      classes = {
        outer: classes,
        inner: ''
      }
    } else if (!classes) {
      throw new Error('Must provide a classes object/string.')
    }
    const svelteClass = Array.from(document.querySelector('.cursor-wrapper').classList).filter(c => /svelte/.test(c)).pop()
    let originalClasses = {
      outer: '',
      inner: ''
    }
    const handleMouseEnter = e => {
      originalClasses.outer = document.querySelector('.custom-cursor.first').className
      originalClasses.inner = document.querySelector('.custom-cursor .custom-cursor').className
      if (classes.outer) {
        if (replace) {
          document.querySelector('.custom-cursor.first').className = `${classes.outer} ${svelteClass}`
        } else {
          document.querySelector('.custom-cursor.first').classList.add(classes.outer)
        }
      }
      if (classes.inner) {
        if (replace) {
          document.querySelector('.custom-cursor .custom-cursor').className = `${classes.inner} ${svelteClass}`
        } else {
          document.querySelector('.custom-cursor .custom-cursor').classList.add(classes.inner)
        }
      }
    }

    const handleMouseLeave = () => {
      document.querySelector('.custom-cursor.first').className = originalClasses.outer
      document.querySelector('.custom-cursor .custom-cursor').className = originalClasses.inner
    }
    return {
      handleMouseEnter,
      handleMouseLeave
    }
  }

  export function plainCursor (node) {
    const { handleMouseEnter, handleMouseLeave } = simpleCursorFactory({
      outer: 'custom-cursor first custom-cursor-hover',
      inner: 'custom-cursor'
    }, true)

    node.addEventListener('mouseenter', handleMouseEnter)
    node.addEventListener('mouseleave', handleMouseLeave)

    return {
      destroy () {
        node.removeEventListener('mouseenter', handleMouseEnter)
        node.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }

  export function crossCursor (node) {
    const { handleMouseEnter, handleMouseLeave } = simpleCursorFactory({
      outer: 'custom-cursor-cross-wrapper',
      inner: 'custom-cursor-cross'
    })

    node.addEventListener('mouseenter', handleMouseEnter)
    node.addEventListener('mouseleave', handleMouseLeave)

    return {
      destroy () {
        node.removeEventListener('mouseenter', handleMouseEnter)
        node.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }
</script>

<script>
  import { spring } from 'svelte/motion'
  import { onMount, afterUpdate } from 'svelte'
  import paper from 'paper'
  import cssVars from 'svelte-css-vars'

  let coords = spring({ x: -100, y: -100 }, {
    stiffness: 0.1,
    damping: 0.4
  })
  let hover
  const handleMouseMove = (e) => coords.set({ x: e.clientX, y: e.clientY })
  export let color = '#fefefe'
  export let type = 'dot'
  let canvas
  let group
  let lastX = 0
  let lastY = 0
  $: styleVars = {
    color
  }

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

<div class="cursor-wrapper" bind:this={wrapper}>
  <div
    use:cssVars={styleVars}
    class="custom-cursor first" 
    class:custom-cursor-dot="{type === 'dot' || type === 'ring'}"
    class:custom-cursor-spot="{type === 'spot'}"
    class:custom-cursor-circle="{type === 'circle'}"
    class:custom-cursor-cross-wrapper="{type === 'cross' || type === 'minus'}"
    class:custom-cursor-hover="{hover === 'hover'}"
    style="transform: translate({$coords.x}px, {$coords.y}px); ">
    <div 
      class="custom-cursor"
      class:custom-cursor-cross="{type === 'cross'}"
      class:custom-cursor-minus="{type === 'minus'}"
      ></div>
  </div>
</div>

<style>
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
}
 .cursor-wrapper.has-blend-mode {
   mix-blend-mode: exclusion;
}
 .custom-cursor {
   position: relative;
   left: 0;
   top: 0;
   transition: width 0.3s linear;
   transition: height 0.3s linear;
}
 .custom-cursor.first {
   border: 1px solid var(--color);
   background: var(--color);
}
 .custom-cursor-dot {
   width: 5px;
   height: 5px;
   border-radius: 50%;
}
 .custom-cursor-spot {
   width: 30px;
   height: 30px;
   opacity: 0.7;
   border-radius: 50%;
}
 .custom-cursor-circle {
   width: 30px;
   height: 30px;
   background-color: transparent !important;
   border-radius: 50%;
}
 .custom-cursor-cross-wrapper.first {
   width: 30px;
   height: 30px;
   background-color: transparent !important;
   border-radius: 50%;
   border: 3px solid var(--color);
}
 .custom-cursor-cross, .custom-cursor-minus {
   position: relative;
   width: 100%;
   height: 100%;
}
 .custom-cursor-cross:before, .custom-cursor-minus:before {
   content: "";
   position: absolute;
   width: 40%;
   height: 1px;
   background: var(--color);
   transition: transform 0.1s linear;
   left: 50%;
   top: 50%;
   transform: translateX(-50%);
}
 .custom-cursor-cross:after {
   content: "";
   position: absolute;
   width: 40%;
   height: 1px;
   background: var(--color);
   transition: transform 0.1s linear;
   left: 50%;
   top: 50%;
   transform: translateX(-50%) rotate(-90deg);
}
 .custom-cursor-hover {
   width: 10px;
   height: 10px;
   opacity: 0.8;
   border-radius: 50%;
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