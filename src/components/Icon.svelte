<div class="inline-block" use:makeicon={{ name, size }}></div>

<script>
    import icons from './icons'

    export let name
    export let size = 14

    function makeicon( node , params ){
        let { name, size } = params

        let svg = createIcon( icons[name] )
        resizeIcon(svg, size)

        node.appendChild(svg)

        function createIcon( str ){
            let el = document.createElement('template')
            el.innerHTML = str

            return el.content.childNodes[0]
        }

        function resizeIcon( icon, size ){
            icon.style.width = `${size}px`
            icon.style.height = `${size}px`
        }

        return {
            update( params ){
                let { name, size } = params

                node.removeChild(svg)

                svg.remove()

                svg = createIcon(icons[name])
                resizeIcon(svg, size)

                node.appendChild(svg)
            }
        }
    }
</script>