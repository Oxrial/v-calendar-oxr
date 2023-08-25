import { isUndefined } from 'lodash'
export class Selector {
    shiftDown = false
    ctrlDown = false
    keyDown = false
    selectBox = null
    isShowSelectBox = false
    selectDays = []
    monthBox = null
    days = null
    downX = 0
    downY = 0
    containerEvents = null
    paneEvents = null
}
export function selectorRender(h) {
    return h(
        'div',
        {
            attrs: {
                id: 'calendar-selection'
            },
            style: {
                display: this.selector.isShowSelectBox ? '' : 'none',
                'z-index': 2
            }
        },
        [
            this.safeScopedSlot('selection-content', { selector: this.selector }) ||
                h(
                    'div',
                    {
                        attrs: {
                            class: 'selection-body'
                        }
                    },
                    [h('span', `已选择[ ${this.selector.selectDays.length} ]天`)]
                )
        ]
    )
}
export default {
    props: {
        isSelector: {
            type: Boolean,
            default: false
        },
        checkSelectionCovered: {
            type: Function,
            default: () => true
        },
        containerId: {
            type: String,
            default: 'month'
        }
    },
    data() {
        return {
            selector: null
        }
    },
    created() {
        this.isSelector && !this.selector && (this.selector = new Selector())
    },
    mounted() {
        this.isSelector && this.selectorInit()
    },
    destroyed() {
        this.isSelector && this.selectorClear(false)
    },
    methods: {
        selectorInit() {
            this.selector.selectBox = document.querySelector(`#${this.containerId} #calendar-selection`)
            this.selector.monthBox = document.getElementById(this.containerId)
            this.selector.days = this.getPageDays()
            this.selector.containerEvents = {
                mousedown: this.handleBox,
                contextmenu: this.contextMenu
            }
            this.selector.paneEvents = {
                dayclick: this.dayclick
            }
        },
        selectorClear(flag = true) {
            this.selector.selectDays = []
            this.loop()
            this.selector = new Selector()
            window.addEventListener('keydown', this.clickKeydown)
            window.addEventListener('keyup', this.clickKeyup)
            flag && this.selectorInit()
        },
        handleBox(e) {
            e.stopPropagation()
            if (e.button === 0) {
                if (!this.selector.ctrlDown && !this.selector.shiftDown && this.selector.selectDays.length !== 0) {
                    this.selector.selectDays = []
                    this.loop()
                }
                this.selector.downX = e.clientX
                this.selector.downY = e.clientY
                this.selector.selectBox.style.left = this.selector.downX + 'px'
                this.selector.selectBox.style.top = this.selector.downY + 'px'
                document.body.addEventListener('mousemove', this.moveselecttion)
                document.body.addEventListener('mouseleave', this.mouseupSelection)
                document.body.addEventListener('mouseup', this.mouseupSelection)
                window.addEventListener('keydown', this.clickKeydown)
                window.addEventListener('keyup', this.clickKeyup)
            }
        },
        clickKeydown(e) {
            switch (e.keyCode) {
                case 16:
                    this.selector.shiftDown = true
                    break
                case 17: // window 键盘
                    this.selector.ctrlDown = true
                    break
                case 91: // mac command  按键
                    this.selector.ctrlDown = true
                    break
            }
        },
        clickKeyup(e) {
            this.selector.shiftDown = false
            this.selector.ctrlDown = false
        },
        moveselecttion(even) {
            this.selector.isShowSelectBox = true
            const { downX, downY } = this.selector
            this.selector.selectBox.style.left = Math.min(even.clientX, downX) + 'px'
            this.selector.selectBox.style.top = Math.min(even.clientY, downY) + 'px'
            this.selector.selectBox.style.width = Math.abs(downX - even.clientX) + 'px'
            this.selector.selectBox.style.height = Math.abs(downY - even.clientY) + 'px'
            this.covered()
        },
        mouseupSelection() {
            this.selector.isShowSelectBox = false
            if (this.selector.selectBox) {
                this.selector.selectBox.style.width = 0 + 'px'
                this.selector.selectBox.style.height = 0 + 'px'
            }
            document.body.addEventListener('mouseleave', this.mouseupSelection)
            document.body.removeEventListener('mousemove', this.moveselecttion)
            document.body.removeEventListener('mouseup', this.mouseupSelection)
        },
        dayDom(day, dw, dh) {
            const dt = day.getBoundingClientRect().top
            const dl = day.getBoundingClientRect().left
            const db = dt + dh
            const dr = dl + dw
            return { dt, dr, db, dl }
        },
        selectDom() {
            const { left, top, width, height } = this.selector.selectBox.style
            const sl = parseInt(left)
            const st = parseInt(top)
            const sw = parseInt(width)
            const sh = parseInt(height)
            const sb = st + sh
            const sr = sl + sw
            return { st, sr, sb, sl }
        },
        covered() {
            const days = Array.from(document.querySelectorAll(`#${this.containerId} .vc-day`)).slice(-this.selector.days.length)
            !this.selector.ctrlDown && !this.selector.shiftDown && (this.selector.selectDays = [])
            const { offsetWidth: dw, offsetHeight: dh } = days[0]
            const { st, sr, sb, sl } = this.selectDom()
            for (let i = 0, len = days.length; i < len; i++) {
                if (!this.selector.selectDays.includes(this.selector.days[i])) {
                    const flag = this.checkSelectionCovered(this.selector.days[i])
                    if (this.selector.days[i].inMonth && (isUndefined(flag) || flag)) {
                        const { dt, dr, db, dl } = this.dayDom(days[i], dw, dh)
                        if (db > st && sr > dl && sb > dt && dr > sl) {
                            // st - dt < dh && dr - sr < dw && db - sb < dh && sl - dl < dw
                            this.selector.selectDays.push(this.selector.days[i])
                        }
                    }
                }
            }
            this.loop()
        },
        loop() {
            const sdays = this.selector.selectDays.map(sday => sday.id)
            this.pages.forEach((p, pindex) => {
                p.days.forEach((_, index) => {
                    this.$set(this.pages[pindex].days[index], 'isSelected', false)
                    sdays.includes(this.pages[pindex].days[index].id) && this.$set(this.pages[pindex].days[index], 'isSelected', true)
                })
            })
        },
        dayclick(day) {
            const flag = this.checkSelectionCovered(day)
            !this.selector.selectDays.find(d => d.id === day.id) && (isUndefined(flag) || flag) && this.selector.selectDays.push(day)
            this.loop()
            this.$emit('dayclick', day)
        },
        contextMenu(e) {
            e.preventDefault()
            this.$emit('month-context-menu', this.selector, e)
            return false
        }
    }
}
