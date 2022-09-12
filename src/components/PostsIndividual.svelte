<script>
    export let liEntry;
</script>

<div class="postcontainer">
    <div class="postpadding"></div>
    <a class="postlink" href={liEntry.link}>
        <div class="postdetails">
            <a class="postauthor" href={liEntry.authlink}>
                <img class="authcover" alt={liEntry.author} src={liEntry.authcover}>
                <img class="authimg" alt={liEntry.author} src={liEntry.authimg}>
            </a>
            <div class="postinfo">
                <a href={liEntry.link}>
                    <h3 class="title">{liEntry.title}</h3>
                </a>
                <a href={liEntry.authlink}>
                    <b class="author">{liEntry.author}</b>
                    <span class="separator">&#183;</span>
                    <span class="date">{liEntry.date}</span>
                </a>
            </div>
        </div>
        <article class="post">
            <img class="thumb" alt={liEntry.title} src={liEntry.thumb}>
            <div class="preview">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel fringilla nibh, vitae congue dolor. Praesent placerat faucibus sapien, eget interdum dui euismod vel. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam ullamcorper vestibulum suscipit. Pellentesque dignissim nulla eget justo mollis blandit. Integer rutrum blandit feugiat. Donec vehicula venenatis velit a accumsan. Duis vel pellentesque lacus. Nunc imperdiet risus non dolor accumsan pellentesque. Sed maximus blandit semper. Proin mollis sapien ut massa sodales, vel euismod lacus aliquam. Aliquam malesuada ultrices augue ac placerat. </div>
            <aside class="sidebar">
                <a href="#likeInstagram">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
                        <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                            <path d="M 45 86.474 c -1.134 0 -2.269 -0.433 -3.134 -1.298 L 28.588 71.898 H 13.821 C 6.2 71.898 0 65.698 0 58.077 V 17.348 C 0 9.727 6.2 3.526 13.821 3.526 h 62.356 C 83.8 3.526 90 9.727 90 17.348 v 40.729 c 0 7.621 -6.2 13.821 -13.822 13.821 H 61.412 L 48.134 85.175 C 47.269 86.041 46.134 86.474 45 86.474 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,37,123); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                            <path d="M 61.434 26.084 c -4.021 -3.509 -10.711 -2.915 -14.484 0.86 L 45 28.896 l -2.105 -2.105 c -3.496 -3.496 -9.041 -4.314 -13.168 -1.59 c -5.673 3.746 -6.238 11.492 -1.695 16.035 L 43.077 56.28 c 1.062 1.062 2.784 1.062 3.846 0 l 14.714 -14.714 c 1.769 -1.769 3.044 -4.043 3.306 -6.53 C 65.302 31.61 64.011 28.333 61.434 26.084 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                        </g>
                    </svg>
                </a>
                <a href="#likeFacebook">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
                        <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                            <path d="M 84.377 58.667 h -0.244 c 3.093 0 5.623 -2.53 5.623 -5.623 v -1.121 c 0 -3.093 -2.53 -5.623 -5.623 -5.623 h -0.669 c 3.093 0 5.623 -2.53 5.623 -5.623 v -1.121 c 0 -3.093 -2.53 -5.623 -5.623 -5.623 L 59.955 33.97 c 2.481 -23.725 -2.337 -29.513 -11.895 -27.292 c -0.641 13.441 -9.152 31.766 -17.814 32.267 v -2.304 c 0 -1.645 -1.508 -2.99 -3.35 -2.99 l -23.545 0 c -1.843 0 -3.35 1.346 -3.35 2.99 l 0 44.127 c 0 1.645 1.508 2.99 3.35 2.99 l 23.545 0 c 1.843 0 3.35 -1.346 3.35 -2.99 l 0 -2.686 c 3.09 3.399 10.625 5.499 17.788 5.319 l 31.699 0 c 3.093 0 5.623 -2.53 5.623 -5.623 v -1.121 c 0 -3.093 -2.53 -5.623 -5.623 -5.623 h 4.644 c 3.093 0 5.623 -2.53 5.623 -5.623 v -1.121 C 90 61.198 87.47 58.667 84.377 58.667 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(251,206,157); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                            <path d="M 30.246 80.769 c 0 1.645 -1.508 2.99 -3.35 2.99 l -23.545 0 c -1.843 0 -3.35 -1.346 -3.35 -2.99 l 0 -44.127 c 0 -1.645 1.508 -2.99 3.35 -2.99 l 23.545 0 c 1.843 0 3.35 1.346 3.35 2.99 L 30.246 80.769 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(60,90,153); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                            <path d="M 83.464 47.323 h -9.337 c -0.565 0 -1.023 -0.457 -1.023 -1.023 c 0 -0.565 0.457 -1.023 1.023 -1.023 h 9.337 c 0.565 0 1.023 0.458 1.023 1.023 C 84.487 46.866 84.029 47.323 83.464 47.323 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(231,187,139); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                            <path d="M 84.132 59.69 H 74.127 c -0.565 0 -1.023 -0.457 -1.023 -1.023 s 0.457 -1.023 1.023 -1.023 h 10.006 c 0.565 0 1.023 0.457 1.023 1.023 S 84.698 59.69 84.132 59.69 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(231,187,139); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                            <path d="M 79.733 72.057 h -5.606 c -0.565 0 -1.023 -0.457 -1.023 -1.023 c 0 -0.565 0.457 -1.023 1.023 -1.023 h 5.606 c 0.565 0 1.023 0.457 1.023 1.023 C 80.756 71.6 80.298 72.057 79.733 72.057 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(231,187,139); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                            <circle cx="15.481000000000002" cy="70.271" r="5.101" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(249,249,249); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
                        </g>
                    </svg>
                </a>
                <a href="#likeTwitter">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
                        <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                            <path d="M 84.646 11.504 C 75.554 1.233 58.335 -0.041 45 13.074 C 31.665 -0.041 14.446 1.233 5.354 11.504 c -9.671 10.926 -5.609 31.318 7.123 47.615 C 18.931 67.38 34.874 80.832 45 86.481 c 10.126 -5.649 26.069 -19.101 32.523 -27.362 C 90.255 42.822 94.318 22.43 84.646 11.504 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(248,48,95); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                        </g>
                    </svg>               
                </a>
            </aside>
        </article>
        <div class="actionbar">
            <a class="comment" draggable="false" href={liEntry.link}>
                <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g stroke="none" stroke-width="1" fill-rule="evenodd">
                        <g fill-rule="nonzero">
                            <path d="M5.25,18 C3.45507456,18 2,16.5449254 2,14.75 L2,6.25 C2,4.45507456 3.45507456,3 5.25,3 L18.75,3 C20.5449254,3 22,4.45507456 22,6.25 L22,14.75 C22,16.5449254 20.5449254,18 18.75,18 L13.0124851,18 L7.99868152,21.7506795 C7.44585139,22.1641649 6.66249789,22.0512036 6.2490125,21.4983735 C6.08735764,21.2822409 6,21.0195912 6,20.7499063 L5.99921427,18 L5.25,18 Z M12.5135149,16.5 L18.75,16.5 C19.7164983,16.5 20.5,15.7164983 20.5,14.75 L20.5,6.25 C20.5,5.28350169 19.7164983,4.5 18.75,4.5 L5.25,4.5 C4.28350169,4.5 3.5,5.28350169 3.5,6.25 L3.5,14.75 C3.5,15.7164983 4.28350169,16.5 5.25,16.5 L7.49878573,16.5 L7.49899997,17.2497857 L7.49985739,20.2505702 L12.5135149,16.5 Z"></path>
                        </g>
                    </g>
                </svg>
                <span>Comments</span>
            </a>
            <a class="share" draggable="false" href={liEntry.link}>
                <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g stroke="none" stroke-width="1" fill-rule="evenodd">
                        <g fill-rule="nonzero">
                            <path d="M6.746704,4 L10.2109085,4 C10.625122,4 10.9609085,4.33578644 10.9609085,4.75 C10.9609085,5.12969577 10.6787546,5.44349096 10.312679,5.49315338 L10.2109085,5.5 L6.746704,5.5 C5.55584001,5.5 4.58105908,6.42516159 4.50189481,7.59595119 L4.496704,7.75 L4.496704,17.25 C4.496704,18.440864 5.42186559,19.4156449 6.59265519,19.4948092 L6.746704,19.5 L16.247437,19.5 C17.438301,19.5 18.4130819,18.5748384 18.4922462,17.4040488 L18.497437,17.25 L18.497437,16.752219 C18.497437,16.3380054 18.8332234,16.002219 19.247437,16.002219 C19.6271328,16.002219 19.940928,16.2843728 19.9905904,16.6504484 L19.997437,16.752219 L19.997437,17.25 C19.997437,19.2542592 18.4250759,20.8912737 16.4465956,20.994802 L16.247437,21 L6.746704,21 C4.74244483,21 3.10543026,19.4276389 3.00190201,17.4491586 L2.996704,17.25 L2.996704,7.75 C2.996704,5.74574083 4.56906505,4.10872626 6.54754543,4.00519801 L6.746704,4 L10.2109085,4 L6.746704,4 Z M14.5006976,6.51985416 L14.5006976,3.75 C14.5006976,3.12602964 15.20748,2.7899466 15.6876724,3.13980165 L15.7698701,3.20874226 L21.7644714,8.95874226 C22.0442311,9.22708681 22.0696965,9.65811353 21.8408438,9.95607385 L21.7645584,10.0411742 L15.7699571,15.7930263 C15.3196822,16.2250675 14.5877784,15.9476738 14.5078455,15.3589039 L14.5006976,15.2518521 L14.5006976,12.5265324 L14.1572053,12.5566444 C11.7575155,12.8069657 9.45747516,13.8878535 7.24265269,15.8173548 C6.72354372,16.2695904 5.9204142,15.8420034 6.00578894,15.1588473 C6.67057872,9.83929778 9.45245108,6.90729635 14.2013326,6.53950096 L14.5006976,6.51985416 L14.5006976,3.75 L14.5006976,6.51985416 Z M16.0006976,5.50864341 L16.0006976,7.25 C16.0006976,7.66421356 15.6649111,8 15.2506976,8 C11.3772927,8 8.97667396,9.67612932 7.93942891,13.1571821 L7.86037164,13.4357543 L8.21256044,13.1989337 C10.4490427,11.7371925 12.7984587,11 15.2506976,11 C15.6303934,11 15.9441885,11.2821539 15.993851,11.6482294 L16.0006976,11.75 L16.0006976,13.4928166 L20.1619348,9.50008715 L16.0006976,5.50864341 Z"></path>
                        </g>
                    </g>
                </svg>
                <span>Share</span>
            </a>
            <a class="more" draggable="false" href={liEntry.link}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.5 3C17.7426 3 18.75 4.00736 18.75 5.25V5.5H17.25V5.25C17.25 4.83579 16.9142 4.5 16.5 4.5H4.25C3.83579 4.5 3.5 4.83579 3.5 5.25V14.75C3.5 15.1642 3.83579 15.5 4.25 15.5H4.5V17H4.25C3.00736 17 2 15.9926 2 14.75V5.25C2 4.00736 3.00736 3 4.25 3H16.5Z"/>
                    <path d="M7.5 8H20C20.2761 8 20.5 8.22386 20.5 8.5V11.7322C21.051 12.0194 21.5557 12.3832 22 12.8096V8.5C22 7.39543 21.1046 6.5 20 6.5H7.5C6.39543 6.5 5.5 7.39543 5.5 8.5V18.5C5.5 19.6046 6.39543 20.5 7.5 20.5H11.7322C11.4876 20.0307 11.2986 19.5278 11.1739 19H7.5C7.22386 19 7 18.7761 7 18.5V8.5C7 8.22386 7.22386 8 7.5 8Z"/>
                    <path d="M23 17.5C23 20.5376 20.5376 23 17.5 23C14.4624 23 12 20.5376 12 17.5C12 14.4624 14.4624 12 17.5 12C20.5376 12 23 14.4624 23 17.5ZM14.5 17C14.2239 17 14 17.2239 14 17.5C14 17.7761 14.2239 18 14.5 18H19.2929L17.6464 19.6464C17.4512 19.8417 17.4512 20.1583 17.6464 20.3536C17.8417 20.5488 18.1583 20.5488 18.3536 20.3536L20.8536 17.8536C21.0488 17.6583 21.0488 17.3417 20.8536 17.1464L18.3536 14.6464C18.1583 14.4512 17.8417 14.4512 17.6464 14.6464C17.4512 14.8417 17.4512 15.1583 17.6464 15.3536L19.2929 17H14.5Z"/>
                </svg>
                <span>See more</span>
            </a>
        </div>
    </a>
</div>

<style>
    .postcontainer {
        background-color: #FFFFFF;
        border: 1px solid #CCCCCC;
        display: inline-block;
        vertical-align: top;
        margin-bottom: 10px;
        position: relative;
        border-radius: 4px;
        min-height: 200px;
        text-align: left;
        width: 100%;
    }

    .postcontainer:hover {
        border-color: #a3a3a3;
    }

    .postcontainer:hover > a {
        text-decoration: none;
    }

    .postcontainer:hover .preview {
        color: #000000;
    }

    .postpadding {
        border-bottom-left-radius: 4px;
        border-top-left-radius: 4px;
        background-color: #CCCCCC;
        position: absolute;
        height: 100%;
        width: 40px;
    }

    .postlink {
        display: inline-block;
        height: 100%;
    }

    .post {
        box-sizing: border-box;
        padding-right: 12px;
        padding-left: 60px;
        position: relative;
        display: block;
        width: 100%;
    }

    .postdetails {
        box-sizing: border-box;
        display: inline-block;
        padding-right: 12px;
        padding-left: 60px;
        position: relative;
        margin-top: 5px;
        width: 100%;
    }

    .postauthor {
        position: relative;
        margin-top: 5px;
        display: block;
        height: 40px;
        width: 40px;
        float: left;
    }

    .authcover {
        border: 1px solid #CCCCCC;
        border-radius: 10px;
        position: absolute;
        object-fit: cover;
        height: 36px;
        width: 36px;
        left: 0;
        top: 0;
    }

    .authimg {
        border: 1px solid #FFFFFF;
        border-radius: 100%;
        position: absolute;
        object-fit: cover;
        height: 24px;
        width: 24px;
        bottom: 0px;
        right: 0px;
    }

    .postinfo {
        width: calc(100% - 40px);
        box-sizing: border-box;
        position: relative;
        padding-left: 5px;
        display: block;
        float: right;
    }

    .postinfo > a {
        color: #4B4C4F;
    }

    .title {
        color: #222222;
        padding: 0;
        margin: 0;
    }

    .author {
        color: #4B4C4F;
        font-weight: 600;
        font-size: 0.75rem;
    }

    .separator {
        color: #4B4C4F;
    }

    .date {
        color: #4B4C4F;
        font-size: 0.75rem;
        padding: 0;
        margin: 0;
    }

    .thumb {
        margin: 0 auto 5px auto;
        box-sizing: border-box;
        object-fit: contain;
        position: relative;
        overflow: hidden;
        max-width: 100%;
        display: block;
    }

    .preview {
        text-overflow: ellipsis;
        box-sizing: border-box;
        overflow-wrap: normal;
        margin-bottom: 10px;
        padding-right: 8px;
        text-align: left;
        overflow: hidden;
        color: #111111;
        width: inherit;
        
        /* proof that god is dead */
        -webkit-line-clamp: 2;
        display: -webkit-inline-box;
        -webkit-box-orient: vertical;
    }

    .actionbar {
        box-sizing: border-box;
        padding-right: 12px;
        padding-left: 50px;
        margin-bottom: 9px;
        width: 100%;
    }

    .actionbar > a {
        background-color: #EDEFF1;
        display: inline-block;
        border-radius: 9999px;
        padding: 4px 10px;
        height: inherit;
    }

    .actionbar > a > svg {
        fill: #4B4C4F;
        height: 100%;
        width: 22px;
    }

    .actionbar > a > span {
        width: calc(100% - 22px);
        box-sizing: border-box;
        font-size: smaller;
        padding-left: 4px;
        line-height: 25px;
        color: #4B4C4F;
        font-weight: 600;
        float: right;
        height: 100%;
    }

    .actionbar > a:hover, .actionbar > a:active {
        background-color: #CCCCCC;
    }

    .actionbar > a:hover > svg, .actionbar > a:active > svg {
        fill: #333333;
    }

    .actionbar > a:hover > span, .actionbar > a:active > span {
        color: #333333;
    }

    .actionbar > a:last-child:hover, .actionbar > a:last-child:active {
        background-color: #0079D3;
    }

    .actionbar > a:last-child:hover > svg, .actionbar > a:last-child:active > svg {
        fill: #FFFFFF;
    }

    .actionbar > a:last-child:hover > span, .actionbar > a:last-child:active > span {
        color: #FFFFFF;
    }

    .sidebar {
        position: absolute;
        display: block;
        height: 200px;
        width: 40px;
        left: 0;
        top: 0;
    }

    .sidebar > a {
        margin-right: auto;
        margin-left: auto;
        display: block;
        width: 100%;
    }

    .sidebar > a > svg {
        height: 28px;
        width: 100%;
    }

    .sidebar > a:hover > svg {
        transition: transform .25s;
        transform: scale(1.2);
    }
</style>