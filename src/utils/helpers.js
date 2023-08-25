import { isArray, isObject, isFunction, isDate } from './_'

export const pad = (val, len, char = '0') => {
    val = val !== null && val !== undefined ? String(val) : ''
    len = len || 2
    while (val.length < len) {
        val = `${char}${val}`
    }
    return val
}

export const colors = [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#bc8dd0',
    '#65deb8',
    '#ff4c00',
    '#ff7500',
    '#ffa400',
    '#fff143',
    '#20fd44',
    '#3eede7',
    '#44cef6',
    '#4b5cc4',
    '#cca4e3',
    '#ff0097',
    '#ee4161',
    '#ffb3a7',
    '#a3d900',
    '#88ebf3',
    '#f3d3e7',
    '#b476e7',
    '#ea7ccc',
    '#65ea09',
    '#c4f078',
    '#7480be',
    '#f62e84',
    '#f69bba',
    '#b483d2',
    '#9483d2',
    '#6ba5d9',
    '#20fd44',
    '#8de79d'
]
/**
 * echarts series颜色初始化
 * @param num
 * @return {*}
 */
export function setColor(num) {
    return colors.slice(0, num)
}

const hex2rgb = hex => [parseInt('0x' + hex.slice(1, 3)), parseInt('0x' + hex.slice(3, 5)), parseInt('0x' + hex.slice(5, 7))]

export const generateOptimalTextColor = hex => {
    const [r, g, b] = hex2rgb(hex)
    return 0.213 * r + 0.715 * g + 0.072 * b > 255 / 2 ? 'black' : 'white'
}

export const evalFn = (fn, args) => (isFunction(fn) ? fn(args) : fn)

export const mergeEvents = (...args) => {
    const result = {}
    args.forEach(e =>
        Object.entries(e).forEach(([key, value]) => {
            if (!result[key]) {
                result[key] = value
            } else if (isArray(result[key])) {
                result[key].push(value)
            } else {
                result[key] = [result[key], value]
            }
        })
    )
    return result
}

export const pageIsValid = page => !!(page && page.month && page.year)

export const pageIsBeforePage = (page, comparePage) => {
    if (!pageIsValid(page) || !pageIsValid(comparePage)) return false
    if (page.year === comparePage.year) return page.month < comparePage.month
    return page.year < comparePage.year
}

export const pageIsAfterPage = (page, comparePage) => {
    if (!pageIsValid(page) || !pageIsValid(comparePage)) return false
    if (page.year === comparePage.year) return page.month > comparePage.month
    return page.year > comparePage.year
}

export const pageIsBetweenPages = (page, fromPage, toPage) => (page || false) && !pageIsBeforePage(page, fromPage) && !pageIsAfterPage(page, toPage)

export const pageIsEqualToPage = (aPage, bPage) => {
    if (!aPage && bPage) return false
    if (aPage && !bPage) return false
    if (!aPage && !bPage) return true
    return aPage.month === bPage.month && aPage.year === bPage.year
}

export const addPages = ({ month, year }, count) => {
    const incr = count > 0 ? 1 : -1
    for (let i = 0; i < Math.abs(count); i++) {
        month += incr
        if (month > 12) {
            month = 1
            year++
        } else if (month < 1) {
            month = 12
            year--
        }
    }
    return {
        month,
        year
    }
}

export const pageRangeToArray = (from, to) => {
    if (!pageIsValid(from) || !pageIsValid(to)) return []
    const result = []
    while (!pageIsAfterPage(from, to)) {
        result.push(from)
        from = addPages(from, 1)
    }
    return result
}

export function datesAreEqual(a, b) {
    const aIsDate = isDate(a)
    const bIsDate = isDate(b)
    if (!aIsDate && !bIsDate) return true
    if (aIsDate !== bIsDate) return false
    return a.getTime() === b.getTime()
}

export const arrayHasItems = array => isArray(array) && array.length

export const mixinOptionalProps = (source, target, props) => {
    const assigned = []
    props.forEach(p => {
        const name = p.name || p.toString()
        const mixin = p.mixin
        const validate = p.validate
        if (Object.prototype.hasOwnProperty.call(source, name)) {
            const value = validate ? validate(source[name]) : source[name]
            target[name] = mixin && isObject(value) ? { ...mixin, ...value } : value
            assigned.push(name)
        }
    })
    return {
        target,
        assigned: assigned.length ? assigned : null
    }
}

export const on = (element, event, handler, opts) => {
    if (element && event && handler) {
        element.addEventListener(event, handler, opts)
    }
}

export const off = (element, event, handler, opts) => {
    if (element && event) {
        element.removeEventListener(event, handler, opts)
    }
}

export const elementContains = (element, child) => !!element && !!child && (element === child || element.contains(child))

export const onSpaceOrEnter = (event, handler) => {
    if (event.key === ' ' || event.key === 'Enter') {
        handler(event)
        event.preventDefault()
    }
}

/* eslint-disable no-bitwise */

export const createGuid = () => {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`
}

export function hash(str) {
    let hashcode = 0
    let i = 0
    let chr
    if (str.length === 0) return hashcode
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i)
        hashcode = (hashcode << 5) - hashcode + chr
        hashcode |= 0 // Convert to 32bit integer
    }
    return hashcode
}

/* eslint-enable no-bitwise */
