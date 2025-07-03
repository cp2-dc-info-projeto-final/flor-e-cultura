<script lang="ts">
	let { children } = $props();
	import '../../static/shared.css';
</script>

<nav>
	<a href="/">home</a>
	<a href="/about">about</a>
</nav>

{@render children()}
