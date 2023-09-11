import { cloneDeep, isUndefined, remove } from 'lodash-es'
export class Selector {
    shiftDown = false
    ctrlDown = false
    keyDown = false
    selectBox = null
    isShowSelectBox = false
    selectedDays = []
    selectedDaysTemp = []
    monthBox = null
    days = []
    daysDom = []
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
                    [h('span', `已选择[ ${this.selector.selectedDaysTemp.length} ]天`)]
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
        },
        checkSelectionOversize: {
            type: Number,
            default: 20
        }
    },
    data() {
        return {
            selector: null
        }
    },
    created() {
        !this.selector && (this.selector = new Selector())
    },
    destroyed() {
        this.selectorClear(false)
    },
    methods: {
        selectorInit() {
            this.$nextTick(() => {
                this.selector.selectBox = document.querySelector(`#${this.containerId} #calendar-selection`)
                this.selector.monthBox = document.getElementById(this.containerId)
                this.selector.days = this.getPageDays()
                this.selector.daysDom = Array.from(document.querySelectorAll(`#${this.containerId} .vc-day`)).slice(-this.selector.days.length)
                this.selector.containerEvents = {
                    mousedown: this.handleBox,
                    contextmenu: this.contextMenu
                }
                this.selector.paneEvents = {
                    dayclick: this.dayclick
                }
            })
        },
        selectorClear(flag = true) {
            this.selector.selectedDays = []
            this.loop([])
            this.selector = new Selector()
            window.removeEventListener('keydown', this.clickKeydown)
            window.removeEventListener('keyup', this.clickKeyup)
            flag && this.selectorInit()
        },
        handleBox(e) {
            if (!this.isSelector) return
            e.stopPropagation()
            if (e.button === 0) {
                if (!this.selector.ctrlDown && !this.selector.shiftDown && this.selector.selectedDays.length !== 0) {
                    this.selector.selectedDays.splice(0, this.selector.selectedDays.length)
                    this.selector.selectedDaysTemp.splice(0, this.selector.selectedDaysTemp.length)
                    this.loop([])
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
                this.moveCover()
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
        moveselecttion(e) {
            const { downX, downY } = this.selector
            const width = Math.abs(downX - e.clientX)
            const height = Math.abs(downY - e.clientY)
            // delay
            if (!this.selector.isShowSelectBox && (width >= this.checkSelectionOversize || height >= this.checkSelectionOversize)) {
                this.selector.isShowSelectBox = true
                this.moving(e, downX, downY, width, height)
            } else this.moving(e, downX, downY, width, height)
        },
        moving(e, downX, downY, width, height) {
            this.selector.selectBox.style.left = Math.min(e.clientX, downX) + 'px'
            this.selector.selectBox.style.top = Math.min(e.clientY, downY) + 'px'
            this.selector.selectBox.style.width = width + 'px'
            this.selector.selectBox.style.height = height + 'px'
            this.moveCover()
        },
        moveCover() {
            const { daysDom, days, ctrlDown, shiftDown } = this.selector
            this.selector.selectedDaysTemp = cloneDeep(this.selector.selectedDays)
            !ctrlDown && !shiftDown && (this.selector.selectedDaysTemp = [])
            const { offsetWidth: dw, offsetHeight: dh } = daysDom[0]
            const { st, sr, sb, sl } = this.selectDom()
            for (let i = 0, len = daysDom.length; i < len; i++) {
                const flag = this.checkSelectionCovered(days[i])
                if (days[i].inMonth && (isUndefined(flag) || flag)) {
                    const { dt, dr, db, dl } = this.dayDom(daysDom[i], dw, dh)
                    // st - dt < dh && dr - sr < dw && db - sb < dh && sl - dl < dw
                    if (db > st && sr > dl && sb > dt && dr > sl) {
                        const ids = this.selector.selectedDaysTemp.map(t => t.id)
                        if (!ctrlDown && !shiftDown) {
                            !ids.includes(days[i].id) && this.selector.selectedDaysTemp.push(days[i])
                        } else {
                            if (!ids.includes(days[i].id)) {
                                this.selector.selectedDaysTemp.push(days[i])
                            } else {
                                remove(this.selector.selectedDaysTemp, s => s.id === days[i].id)
                            }
                        }
                    }
                }
            }
            this.loop(this.selector.selectedDaysTemp)
        },
        mouseupSelection() {
            this.covered()
            this.selector.isShowSelectBox = false
            if (this.selector.selectBox) {
                this.selector.selectBox.style.width = 0 + 'px'
                this.selector.selectBox.style.height = 0 + 'px'
            }
            document.body.removeEventListener('mouseleave', this.mouseupSelection)
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
            this.selector.selectedDays.splice(0, this.selector.selectedDays.length)
            this.selector.selectedDays.push(...this.selector.selectedDaysTemp)
            this.loop(this.selector.selectedDays)
        },
        loop(selectedDays = []) {
            const sdays = selectedDays.map(sday => sday.id)
            this.pages.forEach((p, pindex) => {
                p.days.forEach((_, index) => {
                    this.$set(this.pages[pindex].days[index], 'isSelected', false)
                    sdays.includes(this.pages[pindex].days[index].id) && this.$set(this.pages[pindex].days[index], 'isSelected', true)
                })
            })
        },
        dayclick(day) {
            this.$emit('dayclick', day)
        },
        contextMenu(e) {
            if (!this.isSelector) return
            e.preventDefault()
            this.$emit('month-context-menu', this.selector, e)
            return false
        }
    }
}
