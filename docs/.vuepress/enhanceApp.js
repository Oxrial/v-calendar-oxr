import VCalendar from '../../src/lib'
import './styles/tailwind.css'
import pageComponents from '@internal/page-components'
import Contextmenu from 'vue-contextmenujs'
export default ({ Vue }) => {
    for (const [name, component] of Object.entries(pageComponents)) {
        Vue.component(name, component)
    }
    Vue.use(Contextmenu)
    Vue.use(VCalendar, {
        locales: {
            'pt-PT': {
                firstDayOfWeek: 1,
                masks: {
                    L: 'YYYY-MM-DD' // Default for formatting/parsing dates
                }
            },
            // Added for GitHub Issue #330
            hu: {
                firstDayOfWeek: 2,
                masks: {
                    L: 'YYYY.MM.DD',
                    title: 'YYYY MMMM' // <- this doesn't work
                }
            }
        }
    })
}
