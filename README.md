---
title: 'Selector'
sidebarDepth: 2
---
# Selector <i>**(new)**</i>

## Attibutes
### isSelector enable selector
`ctrl` & `shift` hold on support

```html
    <v-calendar
        :attributes="attributes"
        is-selector
    />
```
<guide-selector-index />

![](./docs/images/1.png)

### containerId

当存在一个以上的多个v-calendar标签时，需通过自定义containerId区分各自的唯一索引，确保命中目标标签 <br />
When there are multiple v-calendar tags, it is necessary to differentiate their unique indexes by customizing the containerId, in order to ensure that the target tag is correctly identified. 

```html
    <v-calendar
        :attributes="attributes"
        is-selector
        :container-id="containerId"
    />
```
```js
    containerId: {
        type: String,
        default: 'month'
    }
```

### check selection covered
```html
    <v-calendar
        :attributes="attributes"
        is-selector
        :check-selection-covered="checkSelectionCovered"
    />
```
```js 
methods: {
    checkSelectionCovered(day) {
        return day.date.getTime() >= day.todayTime
    }
}
```
<guide-selector-index container-id="month1" check />

![](./docs/images/2.png)

### context menu event
example: use vue-contextmenujs module

```html
    <v-calendar
        :attributes="attributes"
        is-selector
        :check-selection-covered="checkSelectionCovered"
        @month-context-menu="contextMenu"
    />
```
```js 
methods: {
    contextMenu(selector, e) {
        // { selectDays } todo
    }
}
```

<guide-selector-index container-id="month2" menu />

![](./docs/images/3.png)

## Scoped Slot
### day-content (dayClass <i>**(new)**</i> export default day-content)


```html
    <v-calendar
        :attributes="attributes"
        is-selector
    >
        <template #day-content="{ day, attributes: attrs, dayProps, dayEvents, dayClass }">
            <div :class="dayClass" v-bind="dayProps" v-on="dayEvents">
                <div class="day-label">{{ day.day }}</div>
            </div>
        </template>
    </v-calendar>
```
<guide-selector-index slot-day container-id="month3" />

### selection-content <i>**(new)**</i>


```html
    <v-calendar
        :attributes="attributes"
        is-selector
    >
        <template #selection-content="{ selector }">
            <div style="width: inherit; height: inherit; background: #0003">SHOW</div>
        </template>
    </v-calendar>
```
<guide-selector-index slot-selection  container-id="month4" />

![](./docs/images/4.png)