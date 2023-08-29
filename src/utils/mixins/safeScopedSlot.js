import { isFunction } from 'lodash-es'

export const safeScopedSlotMixin = {
    methods: {
        safeScopedSlot(name, args, def = null) {
            return isFunction(this.$scopedSlots[name]) ? this.$scopedSlots[name](args) : def
        }
    }
}
