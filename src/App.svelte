<script>
	import Navigationbar from './components/Navigationbar.svelte'
	import Newsbar from './components/Newsbar.svelte'
	import PMInfo from './components/PMInfo.svelte'
	import Posts from './components/Posts.svelte'
	import Footer from './components/zBar.svelte'
</script>

<header>
	<Navigationbar/>
	<Newsbar/>
</header>

<main>
	<PMInfo/>
	<Posts/>
</main>

<footer>
	<Footer/>
</footer>

<style>
	main {
		box-sizing: border-box;
		margin-right: auto;
        margin-left: auto;
		padding: 0 16px;
        width: 1024px;
	}

	footer {
		box-sizing: border-box;
		margin-right: auto;
        margin-left: auto;
		padding: 0 16px;
        width: 1024px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>