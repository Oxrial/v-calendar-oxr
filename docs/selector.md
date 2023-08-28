---
title: 'Selector'
sidebarDepth: 2
---
# Selector <i>**(new)**</i>

## 1. Attibutes
### 1.1 enable selector
ctrl & shift hold on support

```html
    <v-calendar
        :attributes="attributes"
        is-selector
    />
```
<guide-selector-index />

![](./images/1.png)

### 1.2 containerId

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
<guide-selector-index container-id="month1" />

### 1.3 check selection covered
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
<guide-selector-index container-id="month2" check />
![](./images/2.png)

### 1.4 context menu event
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

<guide-selector-index container-id="month3" menu />
![](./images/3.png)

## 2. Scoped Slot
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
<guide-selector-index slot-day container-id="month4" />

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
<guide-selector-index slot-selection  container-id="month5" />

![](./images/4.png)