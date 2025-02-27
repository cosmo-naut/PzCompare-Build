import React from "react";
import { Props_CubeCSS, Props_Element } from "../components/types";

/**
 * @param x - Object
 * @param path - String path
 * @def - Default return value
*/
export function objGet(x: object, path: string, def: any) {
    try {
        return eval(path);
    }

    catch {
        return def;
    }
}

export function propOrDefault<T>(x: T | undefined, def: any): T {
    return x ? x : def;
}

export function createCubeCSSClass(vars: Props_CubeCSS): string {
    return `
        [ ${propOrDefault(vars.blockClass, '')} ] 
        [ ${propOrDefault(vars.compostClass, '')} ] 
        [ ${propOrDefault(vars.utilClass, '')} ]`;
}

export function randomArrLen(maxLen: number): number {
    const buff = new Uint32Array(10);

    return crypto.getRandomValues(buff)[new Date().getMinutes() % 10] % maxLen;
}

/**
 * @param x
 * @returns 'Louna is my cat' => 'lounaismycat
*/
export function collapseText(x: string): string {
    return x.replace(/\s/gm, '').toLowerCase();
}

export function sum(pctArr: number[]): number {
    try {
        return pctArr.reduce((a, b) => a + b);
    }

    catch {
        return 0;
    }
}

/**
 * @param num
 * @param def
 * @summary if the number == 0, then it returns the defValue else number
*/
export function zeroToDef(num: number, def: number): number {
    if(num === 0)
        return def;
    return num;
}

/**
 * @param num
 * @summary Returns the rounded percise version of the number
*/
export function preciseDeci(num: number): number {
    return Number(num.toPrecision(2));
}

/**
 * @param val
 * @param conditions
 * @summary like typeof() but for multiple types
*/
export function hasTypeof(val: any, conditions: string[]) {
    return conditions.includes(typeof(val));
}

/**
 * @summary Recursively opens details by taking the id from data-parent-id of the current element
 * The first id always comes from the item itself (<p>) and the other id's are for the detail elements (<details>).
 * p -> details ?-> details ?-> ...
*/
export function openNestedDetails(itemId: string, targetId: string): any {
    const el = document.getElementById(itemId) as HTMLElement;
    
    if(el) {
        const parentId = el.getAttribute('data-parent-id');

        if(parentId) {
            const detailEl = document.getElementById(parentId) as HTMLDetailsElement;

            detailEl.open = true;
            return openNestedDetails(parentId, targetId);
        }

        else {
            document.getElementById(targetId)?.scrollIntoView()
        }
    }

}

/**
 * 
 * @param props 
 * @returns Defaulted props
 */
export function prepareProps<T extends Props_Element>(props: T, extraCls: Props_CubeCSS = {}): T {
    return {
        ...props,
        variant: propOrDefault<string>(props.variant as string, 'default'),
        secondaryVariant: propOrDefault<string>(props.secondaryVariant as string, 'default'),
        blockClass: propOrDefault(props.blockClass, '') + ' ' + propOrDefault(extraCls.blockClass, ''),
        compostClass: propOrDefault(props.compostClass, '') + ' ' + propOrDefault(extraCls.compostClass, ''),
        utilClass: propOrDefault(props.utilClass, '') + ' ' + propOrDefault(extraCls.utilClass, ''),
        id: propOrDefault(props.id, '')
    }
}

/**
 * 
 * @param toSearch
 * @param x 
 * @returns Basic search function
 */
export function strSearch(toSearch: string, x: string): boolean {
    return toSearch.toLowerCase().indexOf(x.toLowerCase()) > -1;
}

/**
 * @param id
*/
export function toggleTargetDropdown(id: string) {
    const el = document.getElementById(id) as HTMLElement;
    const attr = el.getAttribute('data-dropdown-state')

    if(attr === 'true') {
        el.setAttribute('data-dropdown-state', 'false')
    }

    else if(attr === 'false') {
        el.setAttribute('data-dropdown-state', 'true')
    }
} 

/**
 * @param e
 * @param whitelist - Ignores element with same className
*/
export function toggleDropdowns<T extends Event>(e: T, whitelist: string) {
    e.stopPropagation();

    const target = e.target as HTMLElement;
    const dropdowns = document.querySelectorAll('*[data-dropdown-state]');

    // The id of the possibly clicked dropdown
    const ignoreId = propOrDefault(target.closest('.list')?.id, 'NaE')

    if(!target.classList.contains(whitelist)) {
        dropdowns.forEach(el => {
            if(el.id !== ignoreId)
                el.setAttribute('data-dropdown-state', 'false');
            else
                el.setAttribute('data-dropdown-state', 'true');
        });
    }
}