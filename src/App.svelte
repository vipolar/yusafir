<script>
	//export let name;
	import Navigationbar from './components/Navigationbar.svelte'
	import Newsbar from './components/Newsbar.svelte'
	import PMInfo from './components/PMInfo.svelte'
	import Posts from './components/Posts.svelte'
	import Footer from './components/zFooter.svelte'
	//import Stick from './components/Stick.svelte'
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
		margin-right: auto;
        margin-left: auto;
        width: 1024px;
	}

	footer {
		margin-right: auto;
        margin-left: auto;
        width: 1024px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>