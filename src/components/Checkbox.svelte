<label for={id} class="inline-flex items-center">
    <input on:change={onChange} {tabindex} type="checkbox" name={name} value={value} checked={checked} id={id} class="transition duration-500 rounded text-indigo-500 border-gray-300 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50" />
    {#if $$slots.default}
    <span class="ml-2"><slot></slot></span>
    {/if}
</label>

<script>
    import uniqueStr from 'generate-unique-id'
    import { createEventDispatcher } from 'svelte'
    
    export let id = false
    export let checked = false
    export let value = undefined
    export let name = undefined
    export let tabindex = "0"

    let dispatcher = createEventDispatcher()

    if( !id ){
        id = uniqueStr({ length : 6 })
    }

    function onChange(){
        dispatcher('change' , this.checked)
    }
</script>