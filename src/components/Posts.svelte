<script>
    import PostsControlBar from './PostsCBar.svelte'
    import PostsIndividual from './PostsIndividual.svelte'
    import EntriesJSON from '../../public/static/postDB.json';
    let EntryList = EntriesJSON;
</script>

<div class="postscontainer">
    <h4 class="postsheader">Posts from TravelToGeorgia</h4>
    <section class="posts">
        <PostsControlBar/>
        <ul class="entrylist">
            {#each EntryList as liEntry}
                <li class="postcontainer">
                    <PostsIndividual {liEntry}/>
                </li>
            {/each}
        </ul>
    </section>
</div>

<style>
    .postscontainer{
        box-sizing: border-box;
        padding-right: 10px;
        padding-left: 5px;
        width: 66%;
    }
    
    .postsheader {
        box-sizing: border-box;
        padding-left: 3px;
        font-size: 0.95em;
        text-align: left;
        margin: 5px 0px;
        width: 100%;
    }

    .posts {
        box-sizing: border-box;
    }

    .entrylist {
        list-style: none;
        width: 100%;
        padding: 0;
        margin: 0;
    }
</style>