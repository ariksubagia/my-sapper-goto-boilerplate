<div bind:this={wrapper} class="relative" bind:offsetWidth={wrapperWidth} bind:offsetHeight={wrapperHeight} {style}>
    <img bind:this={image} class="max-w-none transition duration-300 relative block top-0 left-0 opacity-0" alt={alt} use:imageload={{ src }} use:adjustImageDimension={{ width: wrapperWidth, height: wrapperHeight }} />

    <div bind:this={placeholder} class="absolute top-0 left-0 right-0 bottom-0 bg-gray-400 flex justify-center items-center">
        {#if error}
            <span class="text-center text-red-200">failed<br/>to load</span>
        {:else if noimage}
            <span class="text-center text-blue-300">No image</span>
        {:else}
            <span class="text-center text-indigo-50">{alt}</span>
        {/if}
    </div>
</div>

<script>
    export let src
    export let style = undefined
    export let threaded = false
    export let alt = "image loading"

    let wrapper, placeholder, image, error = false

    let wrapperWidth = 0, wrapperHeight = 0

    $: noimage = src === undefined || src === null

    /**
     * Make image fade-in when image successfully loaded
     */
    function imageload( node , params){    
        const { src } = params  

        node.loading = "lazy"

        node.onload = function(){
            if( placeholder ){
                placeholder.classList.add('opacity-0')
            }

            node.classList.remove('opacity-0')
        }

        node.onerror = function(){
            error = true
        }

        if( threaded ){
            /* shift image loading to other thread, still experimental */
            const worker = new Worker('workers/imageFetcher.js')
            worker.onmessage = function( e ){
                let URL = window.URL || window.webkitURL
                node.src = URL.createObjectURL(e.data)
            }
            worker.postMessage(src)
        }else{
            node.src = src
        }

        return {
            update( params ){
                const { src } = params 
                error = false

                if( placeholder ){
                    placeholder.classList.remove('opacity-0')
                }

                node.classList.add('opacity-0')
                node.src = src
            }
        }
    }

    /**
     * Adjust image when wrapper's dimension change
    */
    function adjustImageDimension( node , params ){
        let { width , height } = params

        adjust(width , height)

        function adjust( width, height ){
            const diff = width - height

            if( diff >= 0 ){
                if( node.classList.contains('h-full') )
                    node.classList.remove('h-full')

                if( !node.classList.contains('w-full') )
                    node.classList.add('w-full')
            }else{
                if( node.classList.contains('w-full') )
                    node.classList.remove('w-full')

                if( !node.classList.contains('h-full') )
                    node.classList.add('h-full')
            }
        }

        return {
            update( params ){
                let { width , height } = params
                adjust(width, height)
            }
        }
    }

    function centering( width, height , node){
        const diffWidth = node.offsetWidth - width
        const diffHeight = node.offsetHeight - height

        if( diffWidth > 0 ){
            node.style.marginLeft = `-${diffWidth / 2}px`
        }

        if( diffHeight > 0 ){
            node.style.marginTop = `-${diffHeight / 2}px`
        }
    }
</script>