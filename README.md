# @yerkopalma/cursor

Custom cursor component

## Usage

```svelte
<script>
  import Cursor from '@yerkopalma/cursor'
</script>

<Cursor />
```

## Install

```bash
npm install --save-dev @yerkopalma/cursor
```

## API

### `Cursor` component

The default export is the svelte component adding it into your 
page will affect the your whole site. You can also set the following properties:

- `global: boolean = true` => Set to false to change the cursor element only on the parent component.
- `type: ['dot', 'circle', 'cross', 'minus']` => Predefined types of cursor, defaults to dot.
- `color: string` => A valid css color for the cursor. 

### actions

If you want a different cursor on hover for specific elements, you should 
use predefined actions on those elements, example:

```svelte
<script>
import { magneticCursor } from '@yerkopalma/cursor'
</script>

<a use:magneticCursor>magnetic</a>
```

Availaible actions are:

- magneticCursor
- dotCursor
- crossCursor
- minusCursor
- borderCursor

Also, you can define custom actions for custom hovers

TODO: Document custom actions

## License
MIT