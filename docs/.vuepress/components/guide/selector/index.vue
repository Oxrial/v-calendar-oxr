<template>
    <v-calendar
        ref="calendarRef"
        class="custom-calendar"
        :attributes="attributes"
        is-selector
        :check-selection-covered="day => (check ? day.date.getTime() >= day.todayTime : true)"
        :container-id="containerId"
        @month-context-menu="(selector, e) => menu && contextMenu(selector, e)"
    >
        <template v-if="slotDay" #day-content="{ day, attributes: attrs, dayProps, dayEvents, dayClass }">
            <div :class="dayClass" v-bind="dayProps" v-on="dayEvents">
                <div class="day-label">{{ day.day }}</div>
                🌟
            </div>
        </template>
        <template v-if="slotSelection" #selection-content="{ selector }">
            <div style="width: inherit; height: inherit; background: #0003">SHOW</div>
        </template>
    </v-calendar>
</template>

<script>
import { generateOptimalTextColor, setColor } from '@/utils/helpers'
import { flatMap, groupBy, omit, transform } from 'lodash-es'
export default {
    name: 'Selector',
    props: {
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
                date: '2023-08-13',
                name: '张三'
            },
            {
                date: '2023-08-15',
                name: '张三'
            },
            {
                date: '2023-08-17',
                name: '张三'
            },
            {
                date: '2023-08-12',
                name: '李四'
            },
            {
                date: '2023-08-14',
                name: '李四'
            },
            {
                date: '2023-08-15',
                name: '李四'
            },
            {
                date: '2023-08-11',
                name: '王五'
            },
            {
                date: '2023-08-13',
                name: '王五'
            },
            {
                date: '2023-08-16',
                name: '王五'
            },
            {
                date: '2023-08-14',
                name: '赵六'
            },
            {
                date: '2023-08-17',
                name: '赵六'
            },
            {
                date: '2023-08-18',
                name: '赵六'
            }
        ]
    },
    methods: {
        dataAssembleDocs(data = []) {
            return transform(
                groupBy(data, 'userCode'),
                (res, v) => res.push({ ...omit(v[0], 'date'), name: v[0].name, dates: v.map(vi => vi.date) }),
                []
            )
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
                            color: generateOptimalTextColor(color[i])
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
        contextMenu({ selectDays }, e) {
            this.$contextmenu({
                items: [
                    {
                        label: `已选择${selectDays.length}天`,
                        disabled: true
                    },
                    {
                        label: `新增`,
                        disabled: !selectDays.length,
                        onClick: () => {
                            console.log('新增', selectDays)
                        }
                    }
                ],
                event: e, // 鼠标事件信息
                customClass: 'context-menu', // 自定义菜单 class
                zIndex: 3, // 菜单样式 z-index
                minWidth: 230 // 主菜单最小宽度
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
    padding: 0 3px 2px 3px;
    border-radius: 3px;
    border: 1px solid #fff;
}
.custom-calendar ::v-deep .vc-day .vc-day-content:focus {
    border-radius: unset;
}
.custom-calendar ::v-deep .vc-day:hover {
    border: 1px #87c6f3 solid !important;
    background-color: #eaf6ff !important;
}
.custom-calendar ::v-deep .vc-day:hover .vc-highlight {
    background-color: #feebc8 !important;
}
</style>
