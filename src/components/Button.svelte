<button {tabindex} disabled={props.disabled} class={ determineClass( props ) } type={ props.type } on:click on:mouseup>
    <div class="flex flex-row items-center">
        {#if icon && iconpos === 'left'}
        <div class="flex flex-row items-center px-2">
            <Icon name={icon} size={iconsize} />
        </div>
        {/if}

        <div class="flex-grow px-4 text-center">
            <slot></slot>
        </div>

        {#if icon && iconpos === 'right'}
        <div class="flex flex-row items-center px-2">
            <Icon name={icon} size={iconsize} />
        </div>
        {/if}
    </div>
</button>

<script>
    import Icon from './Icon.svelte'

    export let type = 'button'
    export let outline = false
    export let primary = false
    export let accent = false
    export let secondary = false
    export let disabled = false
    export let rounded = false // true , 'left' , 'top' , 'right' , 'bottom'
    export let shadow = false // true , 'sm' , 'lg' , 'xl' , '2xl'
    export let block = false
    export let inline = false
    export let icon = false
    export let iconpos = 'left'
    export let iconsize = 24
    export let tabindex = "0"
    export let grow = false

    $: props = determineProps({ type, outline, primary, accent, secondary, disabled, shadow, rounded, block, inline, grow })

    function determineProps( ipt ){
        let { primary, accent, secondary } = ipt

        return {
            ...ipt,
            state : determineState(primary,accent,secondary),
        }
    }

    function determineState( primary, accent, secondary ){
        if( primary )
            return 'primary'

        if( accent )
            return 'accent'

        if( secondary )
            return 'secondary'

        return 'normal'
    }

    function determineClass( props ){
        let listClass = ['transition' , 'duration-500' , 'focus:outline-none', 'p-2']

        if( props.outline ){
            appendArray(['border' , 'bg-white' , 'focus:ring-2' ] , listClass)

            switch( props.state ){
                case 'primary' : appendArray([ 'text-indigo-500' , 'border-indigo-500' , 'focus:ring-indigo-500' ] , listClass); break;
                case 'accent' : appendArray([ 'text-red-400' , 'border-red-400', 'focus:ring-red-500' ] , listClass); break;
                case 'secondary' : appendArray([ 'text-gray-500' , 'border-gray-500', 'focus:ring-gray-500' ] , listClass); break;
                default : appendArray([ 'text-black' , 'border-black', 'focus:ring-black' ] , listClass)
            }
        }else{
            switch( props.state ){
                case 'primary' : appendArray([ 'border border-indigo-500' , 'bg-indigo-500' , 'text-white' , 'hover:bg-indigo-400 hover:border-indigo-400' , 'focus:ring' , 'focus:ring-indigo-200' ] , listClass); break;
                case 'accent' : appendArray([ 'border border-red-500', 'bg-red-400' , 'text-white', 'hover:bg-red-300 hover:border-red-300' , 'focus:ring' , 'focus:ring-red-200' ] , listClass); break;
                case 'secondary' : appendArray([ 'border border-gray-500', 'bg-gray-500' , 'text-gray-200', 'hover:bg-gray-400 hover:border-gray-400' , 'focus:ring' , 'focus:ring-gray-200' ] , listClass); break;
                default : appendArray([ 'border border-indigo-500' , 'bg-indigo-100', 'hover:bg-indigo-50 hover:border-indigo-50' , 'focus:ring' , 'focus:ring-indigo-100' ] , listClass)
            }
        }

        if( props.shadow !== false ){
            switch( props.shadow ){
                case 'sm' : appendArray('shadow-sm' , listClass); break;
                case 'md' : appendArray('shadow-md' , listClass); break;
                case 'lg' : appendArray('shadow-lg' , listClass); break;
                case 'xl' : appendArray('shadow-xl' , listClass); break;
                case '2xl' : appendArray('shadow-2xl' , listClass); break;
                default : appendArray('shadow' , listClass)
            }
        }

        if(props.rounded !== false){
            switch( props.rounded ){
                case 'left' : appendArray('rounded-l-lg' , listClass); break;
                case 'top' : appendArray('rounded-t-lg' , listClass); break;
                case 'right' : appendArray('rounded-r-lg' , listClass); break;
                case 'bottom' : appendArray('rounded-b-lg' , listClass); break;
                default : appendArray('rounded-lg' , listClass)
            }  
        }

        if( props.block ){
            switch( props.block ){
                case 'sm' : appendArray('sm:block w-full flex-shrink-0' , listClass); break;
                case 'md' : appendArray('md:block w-full flex-shrink-0' , listClass); break;
                case 'lg' : appendArray('lg:block w-full flex-shrink-0' , listClass); break;
                case 'xl' : appendArray('xl:block w-full flex-shrink-0' , listClass); break;
                case '2xl' : appendArray('2xl:block w-full flex-shrink-0' , listClass); break;
                default : appendArray('block w-full flex-shrink-0' , listClass)
            }
        }          

        if( props.inline ){
            switch( props.inline ){
                case 'sm' : appendArray('sm:inline-block' , listClass); break;
                case 'md' : appendArray('md:inline-block' , listClass); break;
                case 'lg' : appendArray('lg:inline-block' , listClass); break;
                case 'xl' : appendArray('xl:inline-block' , listClass); break;
                case '2xl' : appendArray('2xl:inline-block' , listClass); break;
                default : appendArray('inline-block' , listClass)
            }
        }
        
        if( props.grow ){
            appendArray('flex-grow' , listClass)
        }

        return listClass.join(" ")
    }

    function appendArray( value, ref ){
        if( Array.isArray(value) ){
            value.forEach(v => ref.push(v) )
        }else{
            ref.push(value)
        }
    }
</script>