import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin  from '@fullcalendar/timegrid';
import esLocale  from '@fullcalendar/core/locales/es';
import interactionPlugin  from '@fullcalendar/interaction';

export class FullcalendarConfig {
    public static options:OptionsInput={
        locale : esLocale,
        editable: true,
        plugins: [timeGridPlugin, dayGridPlugin,  interactionPlugin],
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', omitZeroMinute: false, hour12: true, meridiem: 'long'},
        columnHeaderFormat: { weekday: 'long' },
        firstDay: 1,
        header: {left: '', center: '', right:  'timeGridWeek,timeGridDay'},
        allDaySlot: false,
        minTime: "06:00:00",
        maxTime: "22:00:00",
        height: 'auto',
        defaultView: "timeGridWeek"
    }

}
