<template>
    <v-calendar
        ref="calendarRef"
        class="custom-calendar"
        :attributes="attributes"
        :is-selector="isSelector"
        :check-selection-covered="day => (check ? day.date.getTime() >= day.todayTime : true)"
        :container-id="containerId"
        :check-selection-oversize="checkSelectionOversize"
        @selection-before="selectionBefore"
        @month-context-menu="(selector, e) => menu && contextMenu(selector, e)"
        @init-days-method="(days, cb) => dayInit && initDaysMethod(days, cb)"
    >
        <template v-if="slotDay" #day-content="{ day, attributes: attrs, dayProps, dayEvents, dayClass }">
            <div :class="dayClass" v-bind="dayProps" v-on="dayEvents">
                <div class="day-label">{{ day.day }}</div>
                <div class="day-attrs">
                    <template v-for="attr in attrs">
                        <span v-if="attr.customData" :key="attr.customData.name" :class="attr.customData.class" :style="attr.customData.style">{{
                            attr.customData.name
                        }}</span>
                    </template>
                </div>
            </div>
        </template>
        <template v-if="slotSelection" #selection-content="{ selector }">
            <div style="width: inherit; height: inherit; background: #0003">SHOW</div>
        </template>
    </v-calendar>
</template>

<script>
import { generateOptimalTextColor, setColor } from '@/utils/helpers'
import { dropRight, flatMap, groupBy, omit, remove, transform } from 'lodash-es'
import dayjs from 'dayjs'
export default {
    name: 'Selector',
    props: {
        isSelector: {
            type: Boolean,
            default: true
        },
        slotDay: {
            type: Boolean,
            default: false
        },
        slotSelection: {
            type: Boolean,
            default: false
        },
        containerId: {
            type: String,
            default: 'month'
        },
        check: {
            type: Boolean,
            default: false
        },
        menu: {
            type: Boolean,
            default: false
        },
        dayInit: {
            type: Boolean,
            default: false
        },
        checkSelectionOversize: {
            type: Number,
            default: 20
        }
    },
    data() {
        return {
            masks: {
                weekdays: 'WWW'
            },
            data: [],
            docs: [],
            attributes: []
        }
    },
    mounted() {
        this.data = [
            {
                date: dayjs().toDate(),
                name: '张三'
            },
            {
                date: dayjs().add(1, 'day').toDate(),
                name: '张三'
            },
            {
                date: dayjs().add(3, 'day').toDate(),
                name: '张三'
            },
            {
                date: dayjs().add(1, 'day').toDate(),
                name: '李四'
            },
            {
                date: dayjs().add(3, 'day').toDate(),
                name: '李四'
            },
            {
                date: dayjs().add(4, 'day').toDate(),
                name: '李四'
            },
            {
                date: dayjs().add(-1, 'day').toDate(),
                name: '王五'
            },
            {
                date: dayjs().add(3, 'day').toDate(),
                name: '王五'
            },
            {
                date: dayjs().add(5, 'day').toDate(),
                name: '王五'
            },
            {
                date: dayjs().add(2, 'day').toDate(),
                name: '赵六'
            },
            {
                date: dayjs().add(-3, 'day').toDate(),
                name: '赵六'
            },
            {
                date: dayjs().add(4, 'day').toDate(),
                name: '赵六'
            }
        ]
        this.buildAttributes(this.dataAssembleDocs(this.data))
    },
    methods: {
        selectionBefore(e, selector) {
            console.log('selectionBefore ~ e, selector>>> :', e, selector)
        },
        dataAssembleDocs(data = []) {
            return transform(groupBy(data, 'name'), (res, v) => res.push({ ...omit(v[0], 'date'), name: v[0].name, dates: v.map(vi => vi.date) }), [])
        },
        docsLiberateData(docs = []) {
            return flatMap(transform(docs, (res, v) => res.push(v.dates.map(date => ({ date, ...omit(v, 'dates') }))), []))
        },
        buildAttributes(docs) {
            const colors = setColor(docs.length)
            this.attributes = [
                ...docs.map((d, i) => ({
                    customData: {
                        ...d,
                        class: 'day-content',
                        style: {
                            backgroundColor: colors[i],
                            color: generateOptimalTextColor(colors[i])
                        }
                    },
                    dates: d.dates
                })),
                {
                    name: '_TODAY_',
                    highlight: { color: 'orange', fillMode: 'light' },
                    dates: [new Date()]
                }
            ]
        },
        contextMenu({ selectedDays }, e) {
            this.$contextmenu({
                items: [
                    {
                        label: `已选择${selectedDays.length}天`,
                        disabled: true
                    },
                    {
                        label: `新增`,
                        disabled: !selectedDays.length,
                        onClick: () => console.log('新增', selectedDays)
                    }
                ],
                event: e,
                customClass: 'context-menu',
                zIndex: 3,
                minWidth: 230
            })
        },
        initDaysMethod(days, cb) {
            const last7d = days[days.length - 1 - 6]
            if (last7d && !last7d.inMonth) {
                this.setDayHeigth(1 + 1 / 5)
                cb(dropRight(days, 7))
            } else {
                this.setDayHeigth(1)
                cb(days)
            }
        },
        setDayHeigth(coefficient) {
            this.$nextTick(() => {
                const dom = document.querySelector(`#${this.containerId}.custom-calendar`)
                const dayHeight = window.getComputedStyle(dom).getPropertyValue('--day-origin-height').replace('px', '')
                dom.style.setProperty('--day-height', dayHeight * coefficient + 'px')
            })
        }
    }
}
</script>
<style scoped>
.custom-calendar ::v-deep {
    --day-border: 1px solid #b8c2cc;
    --day-border-highlight: 1px solid #b8c2cc;
    --day-width: 90px;
    --day-origin-height: 90px;
    --day-height: 90px;
    --weekday-bg: #f8fafc;
    --weekday-border: 1px solid #eaeaea;

    border-radius: 0;
    width: 100%;
}

.custom-calendar ::v-deep * {
    box-sizing: border-box;
}

.custom-calendar ::v-deep .is-selected {
    border: 1px #63b3ed solid !important;
    background-color: #d7f1ff !important;
}
.custom-calendar ::v-deep .is-selected .day-label {
    color: #fff;
    background-color: #63b3ed;
}
.custom-calendar ::v-deep .vc-day {
    text-align: left;
    height: var(--day-height);
    min-width: var(--day-width);
    background-color: white;
    border: 1px solid transparent;
}
.custom-calendar ::v-deep .vc-day .vc-highlight {
    width: 100%;
    height: 100%;
    border-radius: unset !important;
}

.custom-calendar ::v-deep .vc-day:not(.on-bottom) {
    border-bottom: var(--day-border);
}
.custom-calendar ::v-deep .vc-day:not(.on-bottom).weekday-1 {
    border-bottom: var(--day-border-highlight);
}
.custom-calendar ::v-deep .vc-day:not(.on-right) {
    border-right: var(--day-border);
}
.custom-calendar ::v-deep .vc-day:active {
    transform: scale(0.97);
}
.custom-calendar ::v-deep .vc-day.is-today {
    background-color: var(--orange-200);
}
.custom-calendar ::v-deep .vc-day .vc-day-content {
    padding: 0 5px 3px 5px;
    display: block;
    width: 100%;
    line-height: unset;
    height: 100%;
    border-radius: unset;
}
.custom-calendar ::v-deep .vc-day .vc-day-content .day-label {
    width: 30px;
    text-align: center;
    margin-top: 0.15rem;
    margin-bottom: 1px;
    padding: 0 3px 0 3px;
    border-radius: 3px;
    border: 1px solid #fff;
}
.custom-calendar ::v-deep .vc-day .vc-day-content:focus {
    border-radius: unset;
}
.custom-calendar ::v-deep .vc-day .vc-day-content .day-attrs {
    display: flex;
    flex-wrap: wrap;
}
.custom-calendar ::v-deep .vc-day .vc-day-content .day-content {
    padding: 1px 5px;
    margin: 0 3px 3px 0;
    border-radius: 3px;
}
.custom-calendar ::v-deep .vc-day:hover {
    border: 1px #87c6f3 solid !important;
    background-color: #eaf6ff !important;
}
.custom-calendar ::v-deep .vc-day:hover .vc-highlight {
    background-color: #feebc8 !important;
}
</style>
