import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import Header from "../../Components/Header";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { GetColors } from "../../utils/Theme";
import { formatDate } from "@fullcalendar/core/index.js";

export default function CalendarPage() {
  const [currentEvents, SetCurrentEvents] = useState([]);
  const theme = useTheme();
  const colors = GetColors(theme.palette.mode);

  const HandleDateClicked = (selected) => {
    const title = prompt("Please Enter a title for Event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
    }
  };
  const handleEventClick = (selected) => {
    if (window.confirm("are you sure you want to delte event ?")) {
      selected.event.remove();
    }
  };
  const CalendarThemeCss = {
    mt: 3,

    /* Toolbar (matches DataGrid toolbar) */
    "& .fc-toolbar": {
      backgroundColor: theme.palette.mode === "light" ? "" : "",
      padding: "10px",
      borderRadius: "4px",
    },
    "& .fc-toolbar-title": {
      color: theme.palette.mode === "light" ? "" : "",
      // fontSize:
    },
    "& .fc-button": {
      backgroundColor:
        theme.palette.mode === "light" ? colors.primary[400] : "#141414ff",
      color: "#ffffff",
      border: "none",
    },
    "& .fc-today-button": {
      backgroundColor:
        theme.palette.mode === "light"
          ? colors.primary[400]
          : "#141414ff !important",
      color: "#ffffff",
      border: "none",
    },
    "& .fc-button:hover": {
      opacity: 0.85,
    },
    "& .fc-button-active": {
      backgroundColor: colors.greenAccent[500] + " !important",
    },

    /* Header cells */
    "& .fc-col-header-cell": {
      backgroundColor:
        theme.palette.mode === "light" ? colors.primary[400] : "#464646ff",
      color: "#ffffff",
    },

    /* Day cells */
    "& .fc-daygrid-day": {
      backgroundColor:
        theme.palette.mode === "light" ? "#474779ff" : colors.grey[900],
      border: "1px solid " + colors.grey[300],
      color: theme.palette.mode === "light" ? "#ffffff" : "",
      fontWeight: 600,
      fontSize: 15,
    },

    /* Events */
    "& .fc-event": {
      backgroundColor: colors.greenAccent[500],
      border: "none",
      color: "#ffffff",
    },

    /* Today highlight */
    "& .fc-day-today": {
      backgroundColor: colors.blueAccent[400] + " !important",
      color: colors.grey[900],
    },
  };

  return (
    <Box sx={{ padding: 3, width: "100%" }}>
      <Header title="CALENDAR" subtitle="Manage Events interactively" />
      <Box
        sx={{
          flexDirection: { xs: "column", sm: "column", lg: "row" },
          gap: 1,
          height: "75vh",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          // alignItems: "center",
          // flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            flex: "1 1 20%",
            // background: "red",
            p: "15px",
            borderRadius: "4px",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              marginTop: "25px",
              marginBottom: "5px",
            }}
          >
            Events
          </Typography>
          <Divider margin={2} />
          <List>
            {console.log(currentEvents)}
            {currentEvents.map((event) => {
              return (
                <ListItem
                  key={event.id}
                  sx={{
                    background: colors.greenAccent[500],
                    margin: "10px 0px",
                    borderRadius: "2px",
                  }}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={
                      <Typography>
                        {formatDate(event.start, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
        <Box
          sx={{
            ...CalendarThemeCss,
            flex: "1 1 100%",
            p: 2,
          }}
        >
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next,today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable
            selectable
            selectMirror
            dayMaxEvents
            select={HandleDateClicked}
            eventClick={handleEventClick}
            eventsSet={(events) => {
              SetCurrentEvents(events);
            }}
            initialEvents={[
              {
                id: "123",
                title: "Testing All day",
                date: "2025-12-31",
              },
              {
                id: "456",
                title: "Testing timed",
                date: "2025-12-30",
              },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
}
