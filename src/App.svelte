<script>
  import { Cursor } from './components/components.module.js';
  const body = `
  <h1>@yerkopalma/cursor</h1>
<p>Custom cursor component</p>
<h2>Usage</h2>
<pre class="hljs"><code>&lt;script&gt;
  import Cursor from '@yerkopalma/cursor'
&lt;/script&gt;

&lt;Cursor /&gt;
</code></pre>
<h2>Install</h2>
<pre class="hljs language-bash"><code>npm install --save-dev @yerkopalma/cursor
</code></pre>
<h2>API</h2>
<h3><code>Cursor</code> component</h3>
<p>The default export is the svelte component adding it into your
page will affect the your whole site. You can also set the following properties:</p>
<ul>
<li><code>global: boolean = true</code> =&gt; Set to false to change the cursor element only on the parent component.</li>
<li><code>type: ['dot', 'circle', 'cross', 'minus']</code> =&gt; Predefined types of cursor, defaults to dot.</li>
</ul>
<h3>actions</h3>
<p>If you want a different cursor on hover for specific elements, you should
use predefined actions on those elements, example:</p>
<pre class="hljs"><code>&lt;script&gt;
import { magneticCursor } from '@yerkopalma/cursor'
&lt;/script&gt;

&lt;a use:magneticCursor&gt;magnetic&lt;/a&gt;
</code></pre>
<p>Availaible actions are:</p>
<ul>
<li>magneticCursor</li>
<li>dotCursor</li>
<li>crossCursor</li>
<li>minusCursor</li>
<li>borderCursor</li>
</ul>
<p>Also, you can define custom actions for custom hovers</p>
<p>TODO: Document custom actions</p>
<h2>License</h2>
<p>MIT</p>
  `
</script>

<style>
  .markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 45px;
  }

  @media (max-width: 767px) {
    .markdown-body {
      padding: 15px;
    }
  }
</style>

<svelte:head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css">
</svelte:head>

<article class="markdown-body">
  {@html body}
</article>

<Cursor name="world" />
