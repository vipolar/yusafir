<script>
    import EntriesJSON from '../../public/static/postDB.json';
    import Sticky from './Stick.svelte'
    let auth = EntriesJSON[0];
</script>

<div class="about">
    <h4 class="aboutheader">About</h4>
    <div class="infocontainer">
        <div class="covercontainer">
            <img class="cover" alt={auth.author} src={auth.authcover}>
            <img class="prof" alt={auth.author} src={auth.authimg}>
        </div>
        <h4 class="infoheader">Lorem ipsum dolor...</h4>
        <div class="infoinfo">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dapibus leo magna, lacinia gravida velit rhoncus ac. Nulla euismod leo a turpis sodales, sed pharetra lectus dictum. Aenean sagittis tortor ac pretium accumsan. Maecenas odio lorem, molestie sit amet viverra ac, molestie vitae leo. Sed dictum odio libero, ut vehicula risus iaculis sed. Morbi ac erat commodo, elementum sapien nec, molestie dolor.</div>
        <div class="infolink"></div>
    </div>
    <Sticky/>
</div>

<style>
    .about {
        box-sizing: border-box;
        position: relative;
        padding-left: 10px;
        padding-right: 5px;
        display: block;
        float: right;
        width: 35%;
    }

    .aboutheader {
        margin: 0px 0px 5px 0px;
        box-sizing: border-box;
        font-size: 0.95em;
        padding-left: 3px;
        text-align: left;
        width: 100%;
    }

    .infocontainer {
        background-color: #FFFFFF;
        margin-bottom: 15px;
        position: relative;
        border-radius: 4px;
        display: block;
    }

    .covercontainer {
        overflow: hidden;
        height: 90px;
        width: 100%;
    }

    .cover {
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
        box-sizing: border-box;
        object-fit: cover;
        height: 100%;
        width: 100%;
    }

    .prof {
        border: 1px solid #FFFFFF;
        box-sizing: border-box;
        border-radius: 20px;
        position: absolute;
        object-fit: cover;
        display: block;
        height: 90px;
        width: 90px;
        left: 10px;
        top: 20px;
    }

    .infoheader {
        margin-top: 30px;
        margin-bottom: 0;
        text-align: center;
    }

    .infoinfo {
        padding: 0 20px 20px 20px;
        text-align: center;
    }

    .infolink {
        position: absolute;
        border: 1px solid #CCCCCC;
        box-sizing: border-box;
        border-radius: 4px;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
    }

    .infolink:hover {
        border-color: #a3a3a3;
    }
</style>