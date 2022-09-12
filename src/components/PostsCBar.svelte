<script>
    function locationDropdown(e) {
        document.getElementById("locationDropdown").style.display = "block";
    };

    function typeDropdown(e) {
        document.getElementById("typeDropdown").style.display = "block";
    };

    function cancelDropdown(e) {
        if (!e.target.matches('.buttonOverlay')) {
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
                <button>
                    <span>Everywhere</span>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 30.021 30.021" style="enable-background:new 0 0 30.021 30.021;" xml:space="preserve">
                        <g>
                            <path d="M28.611,13.385l-11.011,9.352c-0.745,0.633-1.667,0.949-2.589,0.949c-0.921,0-1.842-0.316-2.589-0.949L1.411,13.385
                                c-1.684-1.43-1.89-3.954-0.46-5.638c1.431-1.684,3.955-1.89,5.639-0.459l8.421,7.151l8.42-7.151
                                c1.686-1.43,4.209-1.224,5.639,0.459C30.5,9.431,30.294,11.955,28.611,13.385z"/>
                        </g>
                    </svg>
                    <div class="buttonOverlay" on:click={locationDropdown}></div>
                </button>
                <div id="locationDropdown" class="dropdown-content">
                    <a href="#lnk1">Link 1</a>
                    <a href="#lnk2">Link 2</a>
                    <a href="#lnk3">Link 3</a>
                </div>
            </div>
            <div class="type">
                <button>
                    <span>Posts</span>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 30.021 30.021" style="enable-background:new 0 0 30.021 30.021;" xml:space="preserve">
                        <g>
                            <path d="M28.611,13.385l-11.011,9.352c-0.745,0.633-1.667,0.949-2.589,0.949c-0.921,0-1.842-0.316-2.589-0.949L1.411,13.385
                                c-1.684-1.43-1.89-3.954-0.46-5.638c1.431-1.684,3.955-1.89,5.639-0.459l8.421,7.151l8.42-7.151
                                c1.686-1.43,4.209-1.224,5.639,0.459C30.5,9.431,30.294,11.955,28.611,13.385z"/>
                        </g>
                    </svg>
                    <div class="buttonOverlay" on:click={typeDropdown}></div>
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

    button {
        background-color: #f2f8fc;
        border-radius: 10px;
        font-weight: 700;
        font-size: 16px;
        cursor: pointer;
        border: none;
        padding: 5px;
        margin: 0;
    }

    button > span {
        color: #0079D3;
    }

    button > svg {
        fill: #0079D3;
        height: 50%;
        width: 10px;
    }

    button > div {
        position: absolute;
        display: block;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
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