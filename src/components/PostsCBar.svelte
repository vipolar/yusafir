<script>
    function locationDropdown(e) {
        document.getElementById("locationDropdown").style.display = "block";
    };

    function typeDropdown(e) {
        document.getElementById("typeDropdown").style.display = "block";
    };

    function cancelDropdown(e) {
        if (!e.target.matches('.dropbtn')) {
            const dropdowns = document.getElementsByClassName("dropdown-content");

            for (let i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.style.display == "block") {
                    openDropdown.style.display = "none";
                }
            }
        }
    };
</script>

<svelte:window on:click={cancelDropdown}/>

<div class="postscontrol">
    <div class="hot">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <path id="a" d="M-22 2.24h42V22h-42z"/>
            </defs>
            <clipPath id="b">
                <use xlink:href="#a" overflow="visible"/>
            </clipPath>
            <path d="M16.543 8.028c-.023 1.503-.523 3.538-2.867 4.327.734-1.746.846-3.417.326-4.979-.695-2.097-3.014-3.735-4.557-4.627-.527-.306-1.203.074-1.193.683.02 1.112-.318 2.737-1.959 4.378C4.107 9.994 3 12.251 3 14.517 3 17.362 5 21 9 21c-4.041-4.041-1-7.483-1-7.483C8.846 19.431 12.988 21 15 21c1.711 0 5-1.25 5-6.448 0-3.133-1.332-5.511-2.385-6.899-.347-.458-1.064-.198-1.072.375"/>
        </svg>
    </div>
    <div class="controls">
        <div class="buttons">
            <div class="location">
                <button on:click={locationDropdown} class="dropbtn">
                    <span>Everywhere</span>
                    <i></i>
                </button>
                <div id="locationDropdown" class="dropdown-content">
                <a href="#lnk1">Link 1</a>
                <a href="#lnk2">Link 2</a>
                <a href="#lnk3">Link 3</a>
                </div>
            </div>
            <div class="type">
                <button on:click={typeDropdown} class="dropbtn">
                    <span>Posts</span>
                    <i></i>
                </button>
                <div id="typeDropdown" class="dropdown-content">
                <a href="#lnk1">Link 1</a>
                <a href="#lnk2">Link 2</a>
                <a href="#lnk3">Link 3</a>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .postscontrol {
        background-color: #FFFFFF;
        border: 1px solid #CCCCCC;
        margin-bottom: 15px;
        position: relative;
        border-radius: 4px;
        text-align: start;
        height: 60px;
        width: 100%;
    }

    .postscontrol:hover {
        border-color: #a3a3a3;
    }

    .controls {
        box-sizing: border-box;
        position: relative;
        padding-left: 60px;
        padding-right: 2%;
        display: block;
        height: 100%;
        width: 100%;
    }

    .hot {
        box-sizing: border-box;
        display: inline-block;
        border-radius: 10px;
        position: absolute;
        cursor: pointer;
        border: none;
        height: 60px;
        width: 60px;
        margin: 0;
        left: 0;
        top: 0;
    }

    .hot > svg {
        fill: #0079D3;
        display: block;
        margin: 17.5px;
        height: 25px;
        width: 25px;
    }

    .buttons {
        display: inline-block;
        position: relative;
        margin: 15px 0px;
        width: inherit;
        height: 30px;
    }

    .location, .type {
        display: inline-block;
        position: relative;
    }

    .dropbtn {
        background-color: #f2f8fc;
        border-radius: 10px;
        font-weight: 700;
        font-size: 16px;
        cursor: pointer;
        color: white;
        border: none;
        padding: 5px;
        margin: 0;
    }

    .dropbtn > span {
        color: #0079D3;
    }

    .dropbtn > i{
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjMwLjAyMXB4IiBoZWlnaHQ9IjMwLjAyMXB4IiB2aWV3Qm94PSIwIDAgMzAuMDIxIDMwLjAyMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzAuMDIxIDMwLjAyMTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTI4LjYxMSwxMy4zODVsLTExLjAxMSw5LjM1MmMtMC43NDUsMC42MzMtMS42NjcsMC45NDktMi41ODksMC45NDljLTAuOTIxLDAtMS44NDItMC4zMTYtMi41ODktMC45NDlMMS40MTEsMTMuMzg1DQoJCWMtMS42ODQtMS40My0xLjg5LTMuOTU0LTAuNDYtNS42MzhjMS40MzEtMS42ODQsMy45NTUtMS44OSw1LjYzOS0wLjQ1OWw4LjQyMSw3LjE1MWw4LjQyLTcuMTUxDQoJCWMxLjY4Ni0xLjQzLDQuMjA5LTEuMjI0LDUuNjM5LDAuNDU5QzMwLjUsOS40MzEsMzAuMjk0LDExLjk1NSwyOC42MTEsMTMuMzg1eiIgZmlsbD0iIzAwNzlEMyIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=);
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        display: inherit;
        height: 10px;
        width: 10px;
    }

    .dropdown-content {
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        background-color: #f1f1f1;
        position: absolute;
        min-width: 160px;
        display: none;
        z-index: 1;
    }

    .dropdown-content a {
        text-decoration: none;
        padding: 12px 16px;
        color: #000000;
        display: block;
    }

    .dropdown-content a:hover {
        background-color: #ddd;
    }
</style>