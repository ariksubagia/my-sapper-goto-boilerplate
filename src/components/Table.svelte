<style>
    table tbody tr:last-child td{
        border-bottom:0 !important;
    }
</style>

<table class="table-auto w-full" bind:this={table}>
    <thead>
        <tr>
            {#if selectable}
                <th class={ defaults.columnClasses.join(" ") }><Checkbox tabindex="-1" on:change={onCheckboxAllChange} /></th>
            {/if}
            {#each normalizedHeaders as column}
                <th class={column.classes.join(' ')}>{column.text}</th>
            {/each}
        </tr>
    </thead>
    <tbody>        
        {#each normalizedRecords as record}
            <tr tabindex={ selectable ? 0 : "" } class={ "transition-colors duration-300 outline-none border-none " + (record === focusedRow ? 'bg-indigo-50' : '') } on:dblclick={() => onTrDblclick(record)} on:focus={() => onTrFocus(record)} use:rowAction={{ row : record, focused : focusedRow }}>
                {#if selectable}
                    <td class={ defaults.cellClasses.join(" ") }><Checkbox tabindex="-1" checked={ selectedRows.includes(record) } on:change={(e) => { onCheckboxChange(record, e.detail) }} /></td>
                {/if}
                {#each normalizedHeaders as column}
                    <td class={getCell(record, column.name).classes.join(" ")}>{getCell(record, column.name).mutator(getCell(record, column.name), record)}</td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<script>
    import Checkbox from 'components/Checkbox.svelte'

    import { onMount } from 'svelte'

    /**
     * Headers format
     * [
     *  {
     *      name : 'column name/alias',
     *      text : 'column text',
     *      classes : [ 'text-left' ]
     *  }
     * ]
    */
    export let headers = []

    /**
     * Records format
     * [
     *      [
     *          {
     *              value : 'cell value',
     *              column : 'column name/alias',
     *              classes : [ 'text-left' ],
     *              data    : undefined,
     *              mutator : ( cell, row ) => {}
     *          }
     *      ]
     * ]
    */
    export let records = []

    export let selectable = false

    export let defaults = {
        columnClasses : [ 'text-left' , 'border-b-2', 'border-gray-300', 'py-2', 'px-4' ],
        cellClasses : [ 'text-left', 'border-b', 'border-gray-300', 'py-3', 'px-4' ],
        cellMutator : ( cell , row ) => cell.value
    }

    export const focus = () => {
        if( process.browser !== true || !selectable ){
            return
        }

        setRowFocus(normalizedRecords[0])
    }

    export const getFocusedRow = () => {
        return focusedRow
    }

    export const getSelectedRows = () => {
        return selectedRows
    }

    let table, focusedRow = undefined, previousRow = undefined, nextRow = undefined, selectedRows = []
    let ctrl = false, alt = false, shift = false
    let focusedTr = undefined, previousTr = undefined, nextTr = undefined

    $: normalizedHeaders = normalizeHeaders(headers)
    $: normalizedRecords = normalizeRecords(records)

    onMount(() => {
        keyListener()

        return () => {
            keyListener(true)
        }
    })

    function onCheckboxAllChange( e ){
        if( e.detail ){
            selectedRows = [ ...normalizedRecords ]
        }else{
            selectedRows = []
        }
    }

    function onCheckboxChange( row, checked ){
        if( checked ){
            addSelected(row)
        }else{
            removeSelected(row)
        }
    }

    function onTrFocus( row ){
        if( row !== focusedRow )
            setRowFocus(row)
    }

    function onTrDblclick( row ){
        if( !selectable ){
            return
        }

        if( selectedRows.includes(row) )
            selectedRows = selectedRows.filter(r => r !== row)
        else
            addSelected(row)
    }

    function keyListener( destroy ){
        destroy = destroy || false

        let tr = table.querySelector('tr')

        if( destroy ){
            document.removeEventListener('click' , click)
            document.removeEventListener('keydown' , keydown)
            document.removeEventListener('keyup' , keyup)
        }else{
            document.addEventListener('click' , click)
            document.addEventListener('keydown' , keydown)
            document.addEventListener('keyup' , keyup)
        }

        function click( e ){
            if( table === undefined || table === null ){
                return
            }

            if( !is_associated(e.target, table.querySelector('tbody')) ){
                clearRowFocus()
                return
            }

            function is_associated( subject, comparator ){
                if( subject === comparator ){
                    return true
                }

                if( subject.parentNode !== null ){
                    return is_associated(subject.parentNode , comparator)
                }

                return false
            }
        }

        function keydown( e ){
            //F1
            if( e.which === 112 ){
                e.preventDefault()

                focus()

                return
            }

            //control
            if( e.which === 17 && focusedRow && !ctrl ){
                e.preventDefault()
                ctrl = true
                return
            }

            //alt
            if( e.which === 18 && focusedRow && !alt ){
                e.preventDefault()
                alt = true
                return
            }  

            //arrow down
            if( e.which === 40 && focusedRow ){
                e.preventDefault()
                setRowFocus(nextRow)
                return
            }

            //arrow up
            if( e.which === 38 && focusedRow ){
                e.preventDefault()
                setRowFocus(previousRow)
                return
            }

            //spacebar
            if( e.which === 13 && focusedRow ){
                e.preventDefault()

                if( selectedRows.includes(focusedRow) ){
                    selectedRows = selectedRows.filter(r => r !== focusedRow)
                }else{
                    selectedRows = [ ...selectedRows , focusedRow ]
                }

                return
            }
            
            //tab
            if( e.which === 9 && focusedRow ){
                // e.preventDefault()

                if( focusedRow === normalizedRecords[normalizedRecords.length - 1] ){
                    clearRowFocus()
                }

                return
            }
        }

        function keyup( e ){
            if( e.key.toLowerCase() === "control" && ctrl ){
                e.preventDefault()
                ctrl = false
                return
            }

            if( e.key.toLowerCase() === "alt" && alt ){
                e.preventDefault()
                alt = false
                return
            }

            if( e.key.toLowerCase() === "escape" && selectable ){
                e.preventDefault()
                clearRowFocus()
                selectedRows = []
                return
            }
        }
    }

    function normalizeHeaders( headers ){
        return headers.map(header => ({
            classes : defaults.columnClasses,
            ...header
        }))
    }

    function normalizeRecords( records ){
        return records.map(record => {
            return record.map(record => ({
                classes : defaults.cellClasses,
                mutator : defaults.cellMutator,
                data    : undefined,
                ...record
            }))
        })
    }

    function getCell( record , columnName ){
        return record.find(cell => cell.column === columnName)
    }

    function getRowIndex( row ){
        for( let i in normalizedRecords ){
            if( row === normalizedRecords[i] )
                return parseInt(i)
        }

        return -1
    }

    function getPreviousRow(){
        if( focusedRow === normalizedRecords[0] ){
            return normalizedRecords[normalizedRecords.length - 1]
        }

        return normalizedRecords[ getRowIndex( focusedRow ) - 1 ]
    }

    function getNextRow(){
        if( focusedRow === normalizedRecords[normalizedRecords.length - 1] ){
            return normalizedRecords[0]
        }

        return normalizedRecords[ getRowIndex( focusedRow ) + 1 ]
    }

    function setRowFocus( row ){
        focusedRow = row
        previousRow = getPreviousRow()
        nextRow = getNextRow()
    }

    function clearRowFocus(){
        focusedRow = undefined
        previousRow = undefined
        nextRow = undefined
    }

    function addSelected( row ){
        selectedRows = [ ...selectedRows, row ]
    }

    function removeSelected( row ){
        selectedRows = selectedRows.filter(r => r !== row)
    }

    function rowAction( node , params ){
        action(node, params)

        function action( node, params ){
            const { row , focused } = params
        
            if( row === focused ){
                node.focus()
            }
        }

        return {
            update( params ){
                action(node, params)
            }
        }
    }
</script>