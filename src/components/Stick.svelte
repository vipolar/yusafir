<script>
    import sticky from './Sticky.js';

    const stickToTop = true;

    function handleScroll() {
        const elSocails = document.getElementById("targid");
        const elAbout = elSocails.parentElement;
        const elMain = elAbout.parentElement;

        elAbout.style.height = elMain.clientHeight + "px";
    };

    function handleGoToTop() {
        if ('scrollBehavior' in document.body.style)
        window.scroll({
                behavior: 'smooth',
                left: 0,
                top: 0
            });
        else {
            window.scroll(0, 0);
            console.log("nope");
        }
    };
</script>

<svelte:window on:scroll={handleScroll}/>

<div id="targid" class="socialscontainer" use:sticky={{stickToTop}}>
    <div class="socialsheader">Contact us</div>
    <a class="socialswapp" href="#whatsapp">
        <svg width="1024px" height="1024px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <path id="a" d="M1023.941 765.153c0 5.606-.171 17.766-.508 27.159-.824 22.982-2.646 52.639-5.401 66.151-4.141 20.306-10.392 39.472-18.542 55.425-9.643 18.871-21.943 35.775-36.559 50.364-14.584 14.56-31.472 26.812-50.315 36.416-16.036 8.172-35.322 14.426-55.744 18.549-13.378 2.701-42.812 4.488-65.648 5.3-9.402.336-21.564.505-27.15.505l-504.226-.081c-5.607 0-17.765-.172-27.158-.509-22.983-.824-52.639-2.646-66.152-5.4-20.306-4.142-39.473-10.392-55.425-18.542-18.872-9.644-35.775-21.944-50.364-36.56-14.56-14.584-26.812-31.471-36.415-50.314-8.174-16.037-14.428-35.323-18.551-55.744-2.7-13.378-4.487-42.812-5.3-65.649-.334-9.401-.503-21.563-.503-27.148l.08-504.228c0-5.607.171-17.766.508-27.159.825-22.983 2.646-52.639 5.401-66.151 4.141-20.306 10.391-39.473 18.542-55.426C34.154 93.24 46.455 76.336 61.07 61.747c14.584-14.559 31.472-26.812 50.315-36.416 16.037-8.172 35.324-14.426 55.745-18.549 13.377-2.701 42.812-4.488 65.648-5.3 9.402-.335 21.565-.504 27.149-.504l504.227.081c5.608 0 17.766.171 27.159.508 22.983.825 52.638 2.646 66.152 5.401 20.305 4.141 39.472 10.391 55.425 18.542 18.871 9.643 35.774 21.944 50.363 36.559 14.559 14.584 26.812 31.471 36.415 50.315 8.174 16.037 14.428 35.323 18.551 55.744 2.7 13.378 4.486 42.812 5.3 65.649.335 9.402.504 21.564.504 27.15l-.082 504.226z"/>
            </defs>
            <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="512.001" y1=".978" x2="512.001" y2="1025.023">
                <stop offset="0" stop-color="#61fd7d"/>
                <stop offset="1" stop-color="#2bb826"/>
            </linearGradient>
            <use xlink:href="#a" overflow="visible" fill="url(#b)"/>
            <g>
                <path fill="#FFF" d="M783.302 243.246c-69.329-69.387-161.529-107.619-259.763-107.658-202.402 0-367.133 164.668-367.214 367.072-.026 64.699 16.883 127.854 49.017 183.522l-52.096 190.229 194.665-51.047c53.636 29.244 114.022 44.656 175.482 44.682h.151c202.382 0 367.128-164.688 367.21-367.094.039-98.087-38.121-190.319-107.452-259.706zM523.544 808.047h-.125c-54.767-.021-108.483-14.729-155.344-42.529l-11.146-6.612-115.517 30.293 30.834-112.592-7.259-11.544c-30.552-48.579-46.688-104.729-46.664-162.379.066-168.229 136.985-305.096 305.339-305.096 81.521.031 158.154 31.811 215.779 89.482s89.342 134.332 89.312 215.859c-.066 168.243-136.984 305.118-305.209 305.118zm167.415-228.515c-9.177-4.591-54.286-26.782-62.697-29.843-8.41-3.062-14.526-4.592-20.645 4.592-6.115 9.182-23.699 29.843-29.053 35.964-5.352 6.122-10.704 6.888-19.879 2.296-9.176-4.591-38.74-14.277-73.786-45.526-27.275-24.319-45.691-54.359-51.043-63.543-5.352-9.183-.569-14.146 4.024-18.72 4.127-4.109 9.175-10.713 13.763-16.069 4.587-5.355 6.117-9.183 9.175-15.304 3.059-6.122 1.529-11.479-.765-16.07-2.293-4.591-20.644-49.739-28.29-68.104-7.447-17.886-15.013-15.466-20.645-15.747-5.346-.266-11.469-.322-17.585-.322s-16.057 2.295-24.467 11.478-32.113 31.374-32.113 76.521c0 45.147 32.877 88.764 37.465 94.885 4.588 6.122 64.699 98.771 156.741 138.502 21.892 9.45 38.982 15.094 52.308 19.322 21.98 6.979 41.982 5.995 57.793 3.634 17.628-2.633 54.284-22.189 61.932-43.615 7.646-21.427 7.646-39.791 5.352-43.617-2.294-3.826-8.41-6.122-17.585-10.714z"/>
            </g>
        </svg>
        <span>Whatsapp</span>
    </a>
    <a class="socialsgram" href="#instagram">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 551.034 551.034" style="enable-background:new 0 0 551.034 551.034;" xml:space="preserve">
            <g id="XMLID_13_">
                    <linearGradient id="XMLID_2_" gradientUnits="userSpaceOnUse" x1="275.517" y1="4.5714" x2="275.517" y2="549.7202" gradientTransform="matrix(1 0 0 -1 0 554)">
                    <stop  offset="0" style="stop-color:#E09B3D"/>
                    <stop  offset="0.3" style="stop-color:#C74C4D"/>
                    <stop  offset="0.6" style="stop-color:#C21975"/>
                    <stop  offset="1" style="stop-color:#7024C4"/>
                </linearGradient>
                <path id="XMLID_17_" style="fill:url(#XMLID_2_);" d="M386.878,0H164.156C73.64,0,0,73.64,0,164.156v222.722
                    c0,90.516,73.64,164.156,164.156,164.156h222.722c90.516,0,164.156-73.64,164.156-164.156V164.156
                    C551.033,73.64,477.393,0,386.878,0z M495.6,386.878c0,60.045-48.677,108.722-108.722,108.722H164.156
                    c-60.045,0-108.722-48.677-108.722-108.722V164.156c0-60.046,48.677-108.722,108.722-108.722h222.722
                    c60.045,0,108.722,48.676,108.722,108.722L495.6,386.878L495.6,386.878z"/>
                
                    <linearGradient id="XMLID_3_" gradientUnits="userSpaceOnUse" x1="275.517" y1="4.5714" x2="275.517" y2="549.7202" gradientTransform="matrix(1 0 0 -1 0 554)">
                    <stop  offset="0" style="stop-color:#E09B3D"/>
                    <stop  offset="0.3" style="stop-color:#C74C4D"/>
                    <stop  offset="0.6" style="stop-color:#C21975"/>
                    <stop  offset="1" style="stop-color:#7024C4"/>
                </linearGradient>
                <path id="XMLID_81_" style="fill:url(#XMLID_3_);" d="M275.517,133C196.933,133,133,196.933,133,275.516
                    s63.933,142.517,142.517,142.517S418.034,354.1,418.034,275.516S354.101,133,275.517,133z M275.517,362.6
                    c-48.095,0-87.083-38.988-87.083-87.083s38.989-87.083,87.083-87.083c48.095,0,87.083,38.988,87.083,87.083
                    C362.6,323.611,323.611,362.6,275.517,362.6z"/>
                
                    <linearGradient id="XMLID_4_" gradientUnits="userSpaceOnUse" x1="418.306" y1="4.5714" x2="418.306" y2="549.7202" gradientTransform="matrix(1 0 0 -1 0 554)">
                    <stop  offset="0" style="stop-color:#E09B3D"/>
                    <stop  offset="0.3" style="stop-color:#C74C4D"/>
                    <stop  offset="0.6" style="stop-color:#C21975"/>
                    <stop  offset="1" style="stop-color:#7024C4"/>
                </linearGradient>
                <circle id="XMLID_83_" style="fill:url(#XMLID_4_);" cx="418.306" cy="134.072" r="34.149"/>
            </g>
        </svg>        
        <span>Instagram</span>
    </a>
    <a class="socialsface" href="#facebook">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 474.294 474.294" style="enable-background:new 0 0 474.294 474.294;" xml:space="preserve">
            <circle style="fill:#3A5A98;" cx="237.111" cy="236.966" r="236.966"/>
            <path style="fill:#345387;" d="M404.742,69.754c92.541,92.541,92.545,242.586-0.004,335.134
                c-92.545,92.541-242.593,92.541-335.134,0L404.742,69.754z"/>
            <path style="fill:#2E4D72;" d="M472.543,263.656L301.129,92.238l-88.998,88.998l5.302,5.302l-50.671,50.667l41.474,41.474
                l-5.455,5.452l44.901,44.901l-51.764,51.764l88.429,88.429C384.065,449.045,461.037,366.255,472.543,263.656z"/>
            <path style="fill:#FFFFFF;" d="M195.682,148.937c0,7.27,0,39.741,0,39.741h-29.115v48.598h29.115v144.402h59.808V237.276h40.134
                c0,0,3.76-23.307,5.579-48.781c-5.224,0-45.485,0-45.485,0s0-28.276,0-33.231c0-4.962,6.518-11.641,12.965-11.641
                c6.436,0,20.015,0,32.587,0c0-6.623,0-29.481,0-50.592c-16.786,0-35.883,0-44.306,0C194.201,93.028,195.682,141.671,195.682,148.937
                z"/>
        </svg>        
        <span>Facebook</span>
    </a>
    <a class="socialstwtr" href="#twitter">
        <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#1DA1F2" fill-rule="evenodd" d="M24,4.3086 C23.117,4.7006 22.168,4.9646 21.172,5.0836 C22.188,4.4746 22.969,3.5096 23.337,2.3596 C22.386,2.9246 21.332,3.3336 20.21,3.5556 C19.312,2.5976 18.032,1.9996 16.616,1.9996 C13.897,1.9996 11.692,4.2046 11.692,6.9236 C11.692,7.3096 11.736,7.6856 11.82,8.0456 C7.728,7.8406 4.099,5.8806 1.671,2.9006 C1.247,3.6286 1.004,4.4736 1.004,5.3766 C1.004,7.0846 1.873,8.5926 3.195,9.4756 C2.388,9.4486 1.628,9.2276 0.964,8.8596 L0.964,8.9206 C0.964,11.3066 2.661,13.2966 4.914,13.7486 C4.501,13.8626 4.065,13.9216 3.617,13.9216 C3.299,13.9216 2.991,13.8906 2.69,13.8336 C3.317,15.7896 5.135,17.2136 7.29,17.2536 C5.604,18.5736 3.481,19.3606 1.175,19.3606 C0.777,19.3606 0.385,19.3376 0,19.2926 C2.179,20.6886 4.767,21.5046 7.548,21.5046 C16.605,21.5046 21.557,14.0016 21.557,7.4946 C21.557,7.2816 21.552,7.0696 21.543,6.8586 C22.505,6.1636 23.34,5.2966 24,4.3086"/>
          </svg>          
        <span>Twitter</span>
    </a>
    <a class="socialsmail" href="#email">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 559.36 559.36" style="enable-background:new 0 0 559.36 559.36;" xml:space="preserve">
            <path style="fill:#c71610;" d="M503.68,430.917h-448c-17.6,0-32-14.4-32-32V122.789c0-17.6,14.4-32,32-32h448c17.6,0,32,14.4,32,32
                v276.144C535.68,416.517,521.28,430.917,503.68,430.917z"/>
            <g>
                <g>
                    <rect x="118.177" y="199.345" transform="matrix(-0.8145 -0.5801 0.5801 -0.8145 28.9379 698.8115)" style="fill:#FFFFFF;" width="15.999" height="290.869"/>
                    
                    <rect x="287.855" y="337.468" transform="matrix(-0.5802 -0.8145 0.8145 -0.5802 403.3148 898.8185)" style="fill:#FFFFFF;" width="290.886" height="16"/>
                    <polygon style="fill:#FFFFFF;" points="279.68,271.733 0,124.357 7.472,110.197 279.68,253.637 551.888,110.197 559.36,124.357"/>
                </g>
            </g>
        </svg>
        <span>eMail</span>
    </a>
    <div class="gototopdiv">
        <button class="gototop" on:click={handleGoToTop}>Back to top</button>
    </div>
    
</div>

<style>
    .socialscontainer {
        background-color: #FFFFFF;
        border: 1px solid #CCCCCC;
        box-sizing: border-box;
        transition: all 0.3s;
        border-radius: 4px;
        position: sticky;
        padding: 1rem;
        width: 100%;
        top: 1rem;
    }

    .socialscontainer:hover {
        border-color: #a3a3a3;
    }

    .socialsheader {
        margin-top: 10px;
        text-align: center;
        font-weight: 700;
        display: block;
    }

    a {
        margin: 10px;
        display: block;
        font-weight: 700;
    }

    a:hover {
        text-decoration: none;
    }

    a > svg {
        height: 20px;
        width: 20px;
    }

    a > span {
        display: inline-block;
        vertical-align: top;
    }

    .socialswapp {
        color: #25D366;
    }

    .socialsgram {
        color: #E02664;
    }

    .socialsface {
        color: #3A5A98;
    }

    .socialstwtr {
        color: #1DA1F2;
    }

    .socialsmail {
        color: #CC1E32;
    }

    .gototopdiv {
        top: calc(100% + (100vh - 100% - 2rem) - 1.5rem);
        box-sizing: border-box;
        position: absolute;
        width: 100%;
        left: 0;
    }

    .gototop {
        background-color: #0079D3;
        border-radius: 9999px;
        position: relative;
        padding: 6px 24px;
        font-weight: 700;
        color: #FFFFFF;
        margin: 0 auto;
        display: block;
        outline: none;
        border: none;
    }

    .gototop:hover {
        background-color: #3293db;
    }
</style>