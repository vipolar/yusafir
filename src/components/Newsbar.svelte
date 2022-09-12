<script>
    import EntriesJSON from '../../public/static/newsDB.json';
    import { onMount } from 'svelte';
    let EntryList = EntriesJSON;

    function handleNewsScroll() {
        const eList = document.getElementById("newslist");
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
        const eList = document.getElementById("newslist");
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
        const eList = document.getElementById("newslist");
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

<div id="newsbar">
    <h4 id="header">News from TravelToGeorgia</h4>
    <section>
        <ul id="newslist" on:scroll={handleNewsScroll}>
            {#each EntryList as liEntry}
                <li>
                    <a draggable="false" href={liEntry.link}>
                        <img alt={liEntry.title} src={liEntry.thumb}>
                        <div>
                            <h4>{liEntry.date}</h4>
                            <h3>{liEntry.title}</h3>
                            <h5>{liEntry.desc}</h5>
                            <h6><a href={liEntry.link}>Learn more...</a></h6>
                        </div>
                    </a>
                </li>
            {/each}
        </ul>
        <div id="leftscroll" on:click={handleClickLeft}>
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path d="M297.2,478l20.7-21.6L108.7,256L317.9,55.6L297.2,34L65.5,256L297.2,478z M194.1,256L425.8,34l20.7,21.6L237.3,256  l209.2,200.4L425.8,478L194.1,256z"/>
            </svg>
        </div>
        <div id="rightscroll" on:click={handleClickRight}>
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path d="M214.78,478l-20.67-21.57L403.27,256,194.11,55.57,214.78,34,446.46,256ZM317.89,256,86.22,34,65.54,55.57,274.7,256,65.54,456.43,86.22,478Z"/>
            </svg>
        </div>
    </section>
</div>

<style>
    #newsbar {
        box-sizing: border-box;
        margin-bottom: 30px;
        position: relative;
        margin-right: auto;
        margin-left: auto;
        overflow: hidden;
        padding: 0 16px;
        width: 1024px;
    }

    #newsbar > h4 {
        box-sizing: border-box;
        margin: 0 0 5px 0;
        font-size: 0.95em;
        text-align: left;
    }

    #newsbar > section {
        border-radius: 1px; /* 8 */
        position: relative;
        overflow: hidden;
        height: 180px;
        width: 100%;
    }

    #newslist {
        white-space: nowrap;
        overflow: scroll;
        height: 125%;
        width: 100%;
        padding: 0;
        margin: 0;
    }

    #newslist > li {
        display: inline-block;
        vertical-align: top;
        position: relative;
        margin-right: 6px;
        margin-left: 6px;
        overflow: hidden;
        height: 180px;
        width: 240px;
    }

    #newslist > li:first-child {
        margin-left: 0;
    }

    #newslist > li:last-child {
        margin-right: 0;
    }

    #newslist > li > a {
        display: inline-block;
        position: absolute;
        height: inherit;
        width: inherit;
        left: 0;
        top: 0;
    }

    #newslist > li > a > img {
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        height: inherit;
        width: inherit;
    }

    #newslist > li > a:hover > img {
        transition: transform .25s;
        transform: scale(0.99);
    }

    #newslist > li > a > div { /* info container */
        background-image: linear-gradient(transparent, #000000);
        white-space: normal;
        position: absolute;
        border-radius: 8px;
        overflow: hidden;
        height: inherit;
        width: inherit;
        top: 0;
    }

    #newslist > li > a:hover > div, #newslist > li > a:active > div {
        background-image: linear-gradient(transparent, #FF4500);
    }

    #newslist > li > a > div > h4 { /* date */
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

    #newslist > li > a:hover > div > h4 {
        transform: scale(1.0025) translate(-2px, 2px);
        transition: transform .125s;
    }

    #newslist > li > a > div > h3 { /* title */
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

    #newslist > li > a:hover > div > h3 {
        transition: transform .25s;
        transform: scale(1.0125);
    }

    #newslist > li > a > div > h5 { /* description */
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

    #newslist > li > a:hover > div > h5 {
        transition: transform .375s;
        transform: scale(1.0125);
    }

    #newslist > li > a > div > h6 { /* learn more */
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

    #newslist > li > a:hover > div > h6 {
        transition: transform .25s;
        transform: scale(1.0125);
    }

    #leftscroll {
        background-image: linear-gradient(to right, #FFFFFF, transparent);
        padding: 73px 14px 73px 2px;
        box-sizing: border-box;
        position: absolute;
        height: 180px;
        width: 50px;
        left: 0;
        top: 0;
    }

    #leftscroll:hover {
        background-image: linear-gradient(to right, #EEEEEE, transparent);
    }

    #leftscroll > svg {
        position: relative;
        fill: #111111;
        height: 34px;
        width: 34px;
    }

    #leftscroll:hover > svg {
        transition: transform .25s;
        transform: scale(1.2);
        fill: #000000;
    }

    #rightscroll {
        background-image: linear-gradient(to left, #FFFFFF, transparent);
        padding: 73px 2px 73px 14px;
        box-sizing: border-box;
        position: absolute;
        height: 180px;
        width: 50px;
        right: 0;
        top: 0;
    }

    #rightscroll:hover {
        background-image: linear-gradient(to left, #EEEEEE, transparent);
    }

    #rightscroll > svg {
        position: relative;
        fill: #111111;
        height: 34px;
        width: 34px;
    }

    #rightscroll:hover > svg {
        transition: transform .25s;
        transform: scale(1.2);
        fill: #000000;
    }
</style>