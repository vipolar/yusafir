<script>
    import EntriesJSON from '../../public/static/newsDB.json';
    import { onMount } from 'svelte';
    let EntryList = EntriesJSON;

    function handleNewsScroll() {
        const eList = document.getElementById("list");
        const leftScroll = document.getElementById("leftscroll");
        const rightScroll = document.getElementById("rightscroll");
    
        if (eList.scrollLeft === 0)
            leftScroll.style.display = "none";
        else
            leftScroll.style.display = "inline-block";

        if (eList.scrollLeft === eList.scrollLeftMax)
            rightScroll.style.display = "none";
        else
            rightScroll.style.display = "inline-block";
    };

    function handleClickLeft() {
        const eList = document.getElementById("list");
        const eListPos = eList.scrollLeft;
        let scrollvar = 0;

        if (eListPos % 252 !== 0)
            scrollvar = eListPos - (eListPos % 252);
        else
            scrollvar = eListPos - 252;

        if ('scrollBehavior' in eList.style)
            eList.scroll({
                behavior: 'smooth',
                left: scrollvar,
                top: 0
            });
        else
            eList.scroll(scrollvar, 0);
    };

    function handleClickRight() {
        const eList = document.getElementById("list");
        const eListPos = eList.scrollLeft;
        let scrollvar = 0;

        if (eListPos % 252 !== 0)
            scrollvar = eListPos + (252 - (eListPos % 252));
        else
            scrollvar = eListPos + 252;

        if ('scrollBehavior' in eList.style)
            eList.scroll({
                behavior: 'smooth',
                left: scrollvar,
                top: 0
            });
        else
            eList.scroll(scrollvar, 0);
    };

    onMount(() => {
        handleNewsScroll();
    });
</script>

<h4 class="newsheader">News from TravelToGeorgia</h4>
<section class="news">
    <div class="listcontainer">
        <ul id="list" class="entrylist" on:scroll={handleNewsScroll}>
            {#each EntryList as liEntry}
                <li class="listentry">
                    <a class="overlay" draggable="false" href={liEntry.link}><i></i></a>
                    <img class="thumb" alt={liEntry.title} src={liEntry.thumb}>
                    <div class="info"><!--maybe restructure a bit to turn it into an article tag-->
                        <h4 class="date">{liEntry.date}</h4>
                        <h3 class="title">{liEntry.title}</h3>
                        <h5 class="desc">{liEntry.desc}</h5>
                        <h6 class="link"><a href={liEntry.link}>Learn more...</a></h6>
                    </div>
                </li>
            {/each}
        </ul>
        <div id="leftscroll">
            <div class=leftsvg on:click={handleClickLeft}></div>
            <div class=leftgrad></div>
        </div>
        <div id="rightscroll">
            <div class=rightsvg on:click={handleClickRight}></div>
            <div class=rightgrad></div>
        </div>
    </div>
</section>

<style>
    .newsheader {
        font-size: 0.95em;
        margin: 5px auto;
        padding-left: 3px;
        text-align: left;
        width: 1024px;
    }

    .news {
        margin-bottom: 30px;
        overflow: hidden;
        margin-top: 5px;
    }

    .listcontainer {
        border-radius: 8px;
        position: relative;
        margin-right: auto;
        margin-left: auto;
        overflow: hidden;
        width: 1024px;
        height: 180px;
    }

    .entrylist {
        white-space: nowrap;
        overflow: scroll;
        height: 150%;
        width: 100%;
        padding: 0;
        margin: 0;
    }

    .listentry {
        display: inline-block;
        vertical-align: top;
        position: relative;
        margin-right: 6px;
        margin-left: 6px;
        overflow: hidden;
        height: 180px;
        width: 240px;
    }

    .listentry:first-child {
        margin-left: 0;
    }

    .listentry:last-child {
        margin-right: 0;
    }

    .thumb {
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        height: inherit;
        width: inherit;
    }

    .info {
        background-image: linear-gradient(transparent, #000000);
        white-space: normal;
        position: absolute;
        border-radius: 8px;
        overflow: hidden;
        height: inherit;
        width: inherit;
        top: 0;
    }

    .date {
        margin: 0; /* remove defaults */
        text-shadow: 1px 1px 1px #6c6e70;
        box-sizing: border-box;
        position: relative;
        padding-right: 5px;
        margin-bottom: 30%; 
        text-align: right;
        font-size: 0.9em;
        color: #222222;
        width: inherit;
    }

    .title {
        margin: 0; /* remove defaults */
        text-overflow: ellipsis;
        box-sizing: border-box;
        overflow-wrap: normal;
        white-space: nowrap;
        padding-right: 10px;
        padding-left: 10px;
        text-align: left;
        overflow: hidden;
        color: #FFFFFF;
        width: inherit;
    }


    .desc {
        margin: 0; /* remove defaults */
        text-overflow: ellipsis;
        box-sizing: border-box;
        overflow-wrap: normal;
        padding-right: 10px;
        padding-left: 10px;
        text-align: left;
        overflow: hidden;
        color: #FFFFFF;
        width: inherit;
        
        /* proof that god is dead */
        -webkit-line-clamp: 2;
        display: -webkit-inline-box;
        -webkit-box-orient: vertical;
    }

    .link {
        margin: 0; /* remove defaults */
        text-overflow: ellipsis;
        box-sizing: border-box;
        overflow-wrap: normal;
        padding-bottom: 10px;
        padding-right: 10px;
        position: absolute;
        text-align: right;
        overflow: hidden;
        color: #FFFFFF;
        width: inherit;
        bottom: 0;
    }

    .overlay {
        display: inline-block;
        position: absolute;
        height: inherit;
        width: inherit;
        z-index: 1;
        left: 0;
        top: 0;
    }

    .overlay:hover ~ .thumb {
        transition: transform .25s;
        transform: scale(0.99);
    }

    .overlay:hover ~ .info {
        background-image: linear-gradient(transparent, #FF4500);
    }

    .overlay:active ~ .info {
        background-image: linear-gradient(transparent, #FF4500);
    }

    .overlay:hover ~ .info > .date {
        transition: transform .125s;
        transform: scale(1.0025) translate(-2px, 2px);
    }

    .overlay:hover ~ .info > .title {
        transition: transform .25s;
        transform: scale(1.0125);
    }

    .overlay:hover ~ .info > .desc {
        transition: transform .375s;
        transform: scale(1.0125);
    }

    .overlay:hover ~ .info > .link {
        transition: transform .25s;
        transform: scale(1.0125);
    }

    #leftscroll {
        position: absolute;
        left: 0;
        top: 0;
    }

    .leftgrad {   
        background-image: linear-gradient(to right, #FFFFFF, transparent);     
        position: absolute;
        height: 180px;
        width: 50px;
        left: 0;
        top: 0;
    }

    .leftsvg {
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pjxzdmcgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB2ZXJzaW9uPSIxLjEiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik0yOTcuMiw0NzhsMjAuNy0yMS42TDEwOC43LDI1NkwzMTcuOSw1NS42TDI5Ny4yLDM0TDY1LjUsMjU2TDI5Ny4yLDQ3OHogTTE5NC4xLDI1Nkw0MjUuOCwzNGwyMC43LDIxLjZMMjM3LjMsMjU2ICBsMjA5LjIsMjAwLjRMNDI1LjgsNDc4TDE5NC4xLDI1NnoiLz48L3N2Zz4=);
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        position: absolute;
        padding-left: 5px;
        height: 180px;
        width: 30px;
        z-index: 2;
        left: 0;
        top: 0;
        
    }

    .leftsvg:hover ~ .leftgrad {
        background-image: linear-gradient(to right, #d3cece, transparent);
    }

    .leftsvg:hover {
        transition: transform .25s;
        transform: scale(1.2);
    }

    #rightscroll {
        position: absolute;
        right: 0;
        top: 0;
    }

    .rightgrad {
        background-image: linear-gradient(to left, #FFFFFF, transparent);
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        position: absolute;
        height: 180px;
        width: 50px;
        right: 0;
        top: 0;
    }

    .rightsvg {
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pjxzdmcgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgZGF0YS1uYW1lPSJMYXllciAxIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjE0Ljc4LDQ3OGwtMjAuNjctMjEuNTdMNDAzLjI3LDI1NiwxOTQuMTEsNTUuNTcsMjE0Ljc4LDM0LDQ0Ni40NiwyNTZaTTMxNy44OSwyNTYsODYuMjIsMzQsNjUuNTQsNTUuNTcsMjc0LjcsMjU2LDY1LjU0LDQ1Ni40Myw4Ni4yMiw0NzhaIi8+PC9zdmc+);
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        position: absolute;
        padding-right: 5px;
        height: 180px;
        width: 30px;
        z-index: 2;
        right: 0;
        top: 0;
    }

    .rightsvg:hover ~ .rightgrad {
        background-image: linear-gradient(to left, #d3cece, transparent);
    }

    .rightsvg:hover {
        transition: transform .25s;
        transform: scale(1.25);
    }
</style>