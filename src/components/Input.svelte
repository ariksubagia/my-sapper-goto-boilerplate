<div class="flex flex-col">
    {#if props.label}
    <label for={props.id} class={ determineLabelClasses(props) }>{props.label}</label>
    {/if}

    <div class="flex flex-row">
        {#if $$slots['additional-prepend']}
        <div class="flex-shrink-0">
            <slot name="additional-prepend"></slot>
        </div>
        {/if}

        <div class="flex-grow">
            <input 
                {disabled} 
                {name} 
                {autocomplete} 
                {value} 
                {min} 
                {max} 
                {minlength} 
                {maxlength} 
                id={props.id} 
                type={props.type} 
                placeholder={props.placeholder} 
                class={determineInputClasses(props)} 
                on:input={onInput}/>
        </div>

        {#if $$slots['additional-append']}
        <div class="flex-shrink-0 flex flex-col">
            <slot name="additional-append"></slot>
        </div>
        {/if}
    </div>

    {#if props.error && props.error.length > 0}
        <div class="text-red-500"><small>{props.error}</small></div>
    {/if}

    {#if props.success && props.success.length > 0}
        <div class="text-green-500"><small>{props.success}</small></div>
    {/if}
</div>

<script>
    import uniqueString from 'generate-unique-id'

    export let name = undefined
    export let id = false
    export let placeholder = ""
    export let type = "text"
    export let label = false
    export let rounded = false
    export let shadow = false
    export let error = null
    export let success = null
    export let autocomplete = undefined
    export let value = null
    export let disabled = false
    export let align = "left"
    export let min = false
    export let max = false
    export let minlength = false
    export let maxlength = false

    $: props = determineProps({ placeholder, label, rounded, shadow, type, error, success, align })

    function onInput(){
        value = this.value
    }

    function determineProps( ipt ){
        return {
            ...ipt,
            id : id === false ? uniqueString({ length : 6 }) : id
        }
    }

    function determineInputClasses( props ){
        let classes = [ 
            'transition', 
            'duration-500' , 
            'w-full', 
            'p-2', 
            'border-gray-300', 
            'focus:border-indigo-300', 
            'focus:ring-4', 
            'focus:ring-indigo-50', 
            'focus:ring-opacity-50',
            'disabled:bg-gray-300'
        ]

        if( props.rounded ){
            switch( props.rounded ){
                case 'left' : appendArray('rounded-l-lg' , classes); break;
                case 'top' : appendArray('rounded-t-lg' , classes); break;
                case 'right' : appendArray('rounded-r-lg' , classes); break;
                case 'bottom' : appendArray('rounded-b-lg' , classes); break;
                default : appendArray('rounded-lg' , classes)
            }  
        }

        if( props.shadow ){
            switch( props.shadow ){
                case 'sm' : appendArray('shadow-sm' , classes); break;
                case 'md' : appendArray('shadow-md' , classes); break;
                case 'lg' : appendArray('shadow-lg' , classes); break;
                case 'xl' : appendArray('shadow-xl' , classes); break;
                case '2xl' : appendArray('shadow-2xl' , classes); break;
                default : appendArray('shadow' , classes)
            }
        }

        if( props.align ){
            switch( props.align ){
                case 'center' : appendArray('text-center' , classes); break;
                case 'right' : appendArray('text-right' , classes); break;
                case 'justify' : appendArray('text-justify' , classes); break;
                default : appendArray('text-left' , classes)
            }
        }

        if( props.error && props.error.length > 0 ){
            appendArray('border-red-500' , classes)
        }

        if( props.success && props.success.length > 0 ){
            appendArray('border-green-500' , classes)
        }

        return classes.join(" ")
    }

    function determineLabelClasses( props ){
        let classes = [ 'mb-2 block text-gray-600 dark:text-gray-100' ]

        if( props.success && props.success.length > 0 ){
            appendArray('text-green-500' , classes)
        }

        if(props.error && props.error.length > 0){
            appendArray('text-red-500' , classes)
        }

        return classes.join(" ")
    }

    function appendArray( candidate, ref ){
        if( !Array.isArray(candidate) ){
            ref.push(candidate)
            return
        }

        candidate.forEach(r => ref.push(r))
    }
</script>