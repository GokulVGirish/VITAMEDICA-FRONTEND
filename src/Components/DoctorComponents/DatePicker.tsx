import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import "dayjs/locale/en-gb";

dayjs.extend(isBetweenPlugin);
dayjs.locale("en-gb");

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  isInRange: boolean;
  isStart: boolean;
  isEnd: boolean;
  isMarked: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "isInRange" &&
    prop !== "isStart" &&
    prop !== "isEnd" &&
    prop !== "isMarked",
})<CustomPickerDayProps>(({ theme, isInRange, isStart, isEnd, isMarked }) => ({
  borderRadius: 0,
  position: "relative",
  ...(isInRange && {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  }),
  ...(isStart && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  }),
  ...(isEnd && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
  ...(isMarked && {
    color: theme.palette.secondary.main,
    "&::after": {
      content: '"✕"', 
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "1.5rem",
      color: `rgba(255, 0, 0, 0.7)`, 
    },
  }),
}));

function Day(
  props: PickersDayProps<Dayjs> & {
    startDay?: Dayjs | null;
    endDay?: Dayjs | null;
    markedDates?: Dayjs[];
  }
) {
  const { day, startDay, endDay, markedDates, ...other } = props;
  const isInRange =
    startDay &&
    endDay &&
    day.isAfter(startDay, "day") &&
    day.isBefore(endDay, "day");
  const isStart = startDay && day.isSame(startDay, "day");
  const isEnd = endDay && day.isSame(endDay, "day");
  const isMarked = markedDates?.some((markedDate) =>
    day.isSame(markedDate, "day")
  );

  return (
    <CustomPickersDay
      {...other}
      day={day}
      isInRange={!!isInRange}
      isStart={!!isStart}
      isEnd={!!isEnd}
      isMarked={!!isMarked}
      disableMargin
    />
  );
}

interface WeekRangePickerProps {
  onDateRangeChange: (start: string | null, end: string | null) => void;
  markedDates?: string[];
}

const WeekRangePicker = React.forwardRef(
  ({ onDateRangeChange, markedDates = [] }: WeekRangePickerProps, ref) => {
    const [startDay, setStartDay] = React.useState<Dayjs | null>(null);
    const [endDay, setEndDay] = React.useState<Dayjs | null>(null);

    const markedDays = markedDates.map((date) => dayjs(date));

    React.useImperativeHandle(ref, () => ({
      resetSelection: () => {
        setStartDay(null);
        setEndDay(null);
      },
    }));

    const handleDateChange = (day: Dayjs | null) => {
      const today = dayjs().startOf("day");
      if (day && day.isBefore(today)) return;

      if (!startDay || (startDay && endDay)) {
        setStartDay(day);
        setEndDay(null);
        onDateRangeChange(day ? day.format("YYYY-MM-DD") : null, null);
      } else if (day && day.isBefore(startDay)) {
        setStartDay(day);
        onDateRangeChange(
          day.format("YYYY-MM-DD"),
          endDay ? endDay.format("YYYY-MM-DD") : null
        );
      } else if (day && day.diff(startDay, "day") <= 7) {
        setEndDay(day);
        onDateRangeChange(
          startDay.format("YYYY-MM-DD"),
          day.format("YYYY-MM-DD")
        );
      }
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={startDay}
          onChange={handleDateChange}
          showDaysOutsideCurrentMonth
          displayWeekNumber
          minDate={dayjs()} 
          slots={{ day: Day }}
          slotProps={{
            day: (ownerState) =>
              ({
                ...ownerState,
                startDay,
                endDay,
                markedDates: markedDays,
              } as Partial<PickersDayProps<Dayjs>>),
          }}
        />
      </LocalizationProvider>
    );
  }
);

export default WeekRangePicker;
