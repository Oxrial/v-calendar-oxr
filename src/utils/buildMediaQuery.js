import { isString, isArrayLikeObject, map, has, get } from 'lodash-es'

// This function gratuitously borrowed from TailwindCSS
// https://github.com/tailwindcss/tailwindcss/blob/master/src/util/buildMediaQuery.js
export default function buildMediaQuery(screens) {
    // Default min width
    if (isString(screens)) {
        screens = { min: screens }
    }
    // Wrap in array
    if (!isArrayLikeObject(screens)) {
        screens = [screens]
    }
    return screens
        .map(screen => {
            if (has(screen, 'raw')) {
                return screen.raw
            }
            return map(screen, (value, feature) => {
                feature = get(
                    {
                        min: 'min-width',
                        max: 'max-width'
                    },
                    feature,
                    feature
                )
                return `(${feature}: ${value})`
            }).join(' and ')
        })
        .join(', ')
}
