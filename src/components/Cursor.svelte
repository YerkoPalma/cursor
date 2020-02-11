<script>
  import { spring } from 'svelte/motion'

  let coords = spring({ x: -100, y: -100 }, {
    stiffness: 0.1,
    damping: 0.4
  })
  const handleMouseMove = (e) => coords.set({ x: e.clientX, y: e.clientY })
  export let color = '#fefefe'
</script>

<svelte:body
  on:mousemove={handleMouseMove}
/>

<div class="cursor-wrapper">
  <div class="custom-cursor custom-cursor__outer" style="transform: translate({$coords.x}px, {$coords.y}px); border: 1px solid {color}; background: {color};">
    <div class="custom-cursor custom-cursor__inner"></div>
  </div>
</div>

<style type="text/scss">
:global(body) {
  cursor: none !important;
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
  &.has-blend-mode {
    mix-blend-mode: exclusion;
  }
}

.custom-cursor {
  position: relative;
  left: 0;
  top: 0;

  &__outer {
    width: 5px;
    height: 5px;
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

</style>