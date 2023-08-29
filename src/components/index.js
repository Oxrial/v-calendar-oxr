import Calendar from './Calendar'
Calendar.install = function (Vue) {
    Vue.component(Calendar.name, Calendar)
}
import CalendarNav from './CalendarNav'
CalendarNav.install = function (Vue) {
    Vue.component(CalendarNav.name, CalendarNav)
}
import DatePicker from './DatePicker'
DatePicker.install = function (Vue) {
    Vue.component(DatePicker.name, DatePicker)
}
import Popover from './Popover'
Popover.install = function (Vue) {
    Vue.component(Popover.name, Popover)
}
export { Calendar, CalendarNav, DatePicker, Popover }
