<div bind:this={wrapper} class="modal-wrapper invisible overflow-y-auto fixed z-50 top-0 right-0 bottom-0 left-0 flex flex-col flex-wrap items-start sm:items-center justify-center bg-black bg-opacity-50">
    <div bind:this={container} class={ "transition-all transform-gpu origin-center duration-300 scale-50 opacity-0 flex flex-col flex-grow sm:flex-grow-0 bg-white flex-shrink-0 rounded-none sm:rounded-lg shadow-lg "+ containerClass }>

        <div class="modal-header flex flex-row flex-shrink-0 sticky top-0 bg-white shadow-lg sm:relative sm:bg-transparent sm:shadow-none">
            <div class="modal-title text-lg font-bold flex-grow flex-shrink-0 px-4 py-3">{title}</div>
            {#if !noclosebtn}
            <div class="modal-title-close flex-shrink-0 flex flex-col">
                <a href="/#" on:click|preventDefault={() => { close() }} class="flex-grow flex items-center justify-center hover:bg-gray-100 px-4 rounded-none sm:rounded-tr-lg"><Icon name="x" /></a>
            </div>
            {/if}
        </div>

        <div class="modal-body flex-shrink-0 bg-white sm:bg-transparent flex-grow sm:flex-grow-0">
            <slot><div class="p-4">Nothing here</div></slot>
        </div>

        <div class="modal-footer flex-shrink-0 sticky bottom-0 bg-white sm:relative sm:bg-transparent">
            <slot name="modal-footer"></slot>
        </div>

    </div>
</div>

<script>
    import Icon from 'components/Icon.svelte'

    import { createEventDispatcher } from 'svelte'

    export let title = ''
    export let nooverlayclose = false
    export let noclosebtn = false
    export let containerClass = ''

    export const close = () => {
        dispatcher('closing')
        closeModal().then(() => {
            dispatcher('closed')
        })
    }

    export const cancel = () => {
        dispatcher('cancelling')
        closeModal().then(() => {
            dispatcher('cancelled')
        })
    }

    export const show = () => {
        dispatcher('opening')
        openModal().then(() => {
            dispatcher('opened')
        })
    }

    let dispatcher = createEventDispatcher()
    let wrapper, container

    function openModal(){
        wrapper.classList.remove('invisible')
        document.querySelector('body').classList.add('overflow-hidden')

        container.classList.add('scale-100')
        container.classList.add('opacity-100')
        
        const anim = () => {
            return new Promise(( resolve, reject ) => {
                setTimeout(() => {
                    container.classList.remove('scale-0')
                    container.classList.remove('opacity-0')
                    wrapper.addEventListener('click' , clickListener)
                    resolve()
                }, 300) 
            })
        }

        return anim()
    }

    function closeModal(){
        container.classList.add('scale-50')
        container.classList.add('opacity-0')

        const anim = () => {
            return new Promise(( resolve,  reject ) => {
                setTimeout(() => {
                    container.classList.remove('scale-100')
                    container.classList.remove('opacity-100')
                    wrapper.removeEventListener('click' , clickListener)
                    wrapper.classList.add('invisible')
                    document.querySelector('body').classList.remove('overflow-hidden')
                    resolve()
                }, 300) 
            })
        }

        return anim()
    }


    function clickListener( e ){
        if( e.target === wrapper && !nooverlayclose ){
            e.preventDefault()
            close()
            return
        }
    }
</script>