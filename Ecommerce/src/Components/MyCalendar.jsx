import React from "react";
import { ResponsiveCalendar } from "@nivo/calendar";
import { Box } from "@mui/material";
import { CalendarData } from "../Data/CalendarData";

const MyCalendar = ({ data = CalendarData }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh", // full viewport height
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ResponsiveCalendar
        data={data}
        from="2016-07-01"
        to="2016-07-12"
        emptyColor="#eeeeee"
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        yearSpacing={1}
        monthBorderColor="#ffffff"
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        legends={[
          {
            anchor: "bottom-right",
            direction: "row",
            translateY: 36,
            itemCount: 6,
            itemWidth: 92,
            itemHeight: 96,
            itemsSpacing: 94,
            itemDirection: "right-to-left",
          },
        ]}
      />
    </Box>
  );
};

export default MyCalendar;
