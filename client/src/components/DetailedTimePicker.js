import { useEffect, useState } from "react";
import TableDragSelect from "react-table-drag-select";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  format,
  addDays,
  differenceInCalendarDays,
  add,
  startOfWeek,
  getHours,
  getMinutes,
  weeksToDays,
} from "date-fns";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";

function DetailedTimePicker(props) {
  let now = new Date();
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let init = startOfWeek(now);
  init.setDate(now.getDate() - now.getDay());
  let [weekStart, setWeekStart] = useState(init);
  let [selectedRanges, setSelectedRanges] = useState(
    props.selectedRanges || []
  );
  let [currentRange, setCurrentRange] = useState(undefined);
  let [tableUpdater, setTableUpdater] = useState(0);
  let [visibleDays, setVisibleDays] = useState([]);
  let hourOptions = [...Array(24)].map((e, i) => {
    if (i < 12) {
      return i == 0 ? "12 am" : i + " am";
    } else {
      return i - 12 == 0 ? "12 pm" : i - 12 + " pm";
    }
  });
  let minuteOptions = [0, 15, 30, 45];
  let NUM_DAYS_VISIBLE = 7;
  let NUM_TIMESLOTS_VISIBLE = 24 * minuteOptions.length;
  let empty_cells = () =>
    [...Array(NUM_TIMESLOTS_VISIBLE)].map((i) =>
      [...Array(NUM_DAYS_VISIBLE + 1)].map((j) => false)
    );
  let [cells, setCells] = useState(empty_cells());

  let isCurrentWeek = (time) => {
    let diff = differenceInCalendarDays(time, weekStart);
    return diff >= 0 && diff < 7;
  };

  useEffect(() => {
    let days = [...Array(NUM_DAYS_VISIBLE)].map((e, i) => {
      let newDate = new Date(weekStart);
      newDate.setDate(weekStart.getDate() + i);
      return newDate;
    });
    setVisibleDays(days);
  }, [weekStart]);

  useEffect(() => {
    props.onChange(selectedRanges);
  }, [selectedRanges]);

  useEffect(() => {}, [props.selectedRanges]);

  let updateRanges = (newCells) => {
    let ranges = [];
    let rangeStart = undefined;
    // add 1 to days because rows start with a label.
    for (var d = 0; d < NUM_DAYS_VISIBLE; d++) {
      for (var h = 0; h <= 96; h++) {
        if (h == 96 || !newCells[h][d + 1]) {
          if (rangeStart) {
            ranges.push([
              rangeStart,
              add(weekStart, {
                days: d,
                hours: Math.floor(h / 4),
                minutes: (h % 4) * 15,
              }),
            ]);
            rangeStart = undefined;
          }
        } else {
          rangeStart =
            rangeStart ||
            add(weekStart, {
              days: d,
              hours: Math.floor(h / 4),
              minutes: (h % 4) * 15,
            });
        }
      }
    }

    setSelectedRanges([
      ...selectedRanges.filter((range) => !isCurrentWeek(range[0])),
      ...ranges,
    ]);
    setCells(newCells);
  };

  // when the user moves back or forth a week, update the cells to reflect the new week's data.
  useEffect(() => {
    let newCells = empty_cells();
    selectedRanges.forEach(([start, end]) => {
      let dayOffset = differenceInCalendarDays(start, weekStart);
      if (dayOffset >= 0 && dayOffset < 7) {
        let m15PeriodOfStart = Math.round(
          4 * (getHours(start) + getMinutes(start) / 60)
        );
        let m15PeriodOfEnd = Math.round(
          4 * (getHours(end) + getMinutes(end) / 60)
        );
        for (var i = m15PeriodOfStart; i < m15PeriodOfEnd; i++) {
          newCells[i][dayOffset + 1] = true;
        }
      }
    });
    setCells(newCells);
    setTableUpdater(tableUpdater + 1);
  }, [weekStart, selectedRanges]);

  return (
    <div className="h-full">
      <div className="w-full flex flex-row items-center justify-between mt-2 mb-4 px-2 md:px-8 space-x-4">
        <div>
          <FontAwesomeIcon
            icon={faCircleArrowLeft}
            className="text-red-500 cursor-pointer"
            size="xl"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
          ></FontAwesomeIcon>
        </div>
        <div className="flex flex-row items-center space-x-8">
          <div className="text-lg text-center md:border-b-2 md:border-red-500 md:px-2 md:pb-1">
            Week of {format(weekStart, "LLLL d")}
          </div>
          {selectedRanges.length > 0 && (
            <div className="flex flex-row justify-center">
              <a
                className="a text-center"
                onClick={() => {
                  setSelectedRanges([]);
                }}
              >
                Clear Selections
              </a>
            </div>
          )}
        </div>

        <div>
          <FontAwesomeIcon
            icon={faCircleArrowRight}
            className="text-red-500 cursor-pointer"
            size="xl"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
          ></FontAwesomeIcon>
        </div>
      </div>
      <table className="w-full table-fixed">
        <tr>
          <td></td>
          {visibleDays.map((day) => (
            <td key={day} disabled className="border-b text-xs sm:text-base">
              <div className="text-center">{format(day, "E")}</div>
              <div style={{ lineHeight: "1.5rem" }} className="text-center">
                {format(day, "L/d")}
              </div>
            </td>
          ))}
        </tr>
      </table>
      <div
        className="h-[calc(100%-_8rem)] overflow-y-scroll"
        id="detailedPicker"
      >
        <TableDragSelect
          key={tableUpdater}
          value={cells}
          onChange={updateRanges}
        >
          {hourOptions.map((hour) =>
            minuteOptions.map((minute) => (
              <tr key={hour + "_" + minute}>
                <td className="text-xs md:text-base" disabled>
                  {minute == 0 ? hour : ""}
                </td>
                {[...Array(NUM_DAYS_VISIBLE)].map((i) => (
                  <td
                    className={`border-x ${minute == 0 && "border-t"} ${
                      minute == 45 && hour == "11 pm" && "border-b"
                    }`}
                  ></td>
                ))}
              </tr>
            ))
          )}
        </TableDragSelect>
      </div>
    </div>
    // <div className="w-full">
    //   <div className="flex flex-row">
    //     <div class>
    //       {hourOptions.map((hour) => (
    //         <div>{hour}</div>
    //       ))}
    //     </div>
    //     {visibleDays.map((day) => (
    //       <div className="flex-grow">
    //         <div className="text-center">{days[day.getDay()]}</div>
    //         <div className="text-center">
    //           {day.getMonth() + 1 + "/" + (day.getDay() + 1)}
    //         </div>
    //         {hourOptions.map((hour) =>
    //           minuteOptions.map((minute) => (
    //             <div
    //               className={`h-2 border-x border-slate-200 ${
    //                 minute == 0 ? "border-t" : ""
    //               }`}
    //               onMouseDown={() => handleMouseDown()}
    //             ></div>
    //           ))
    //         )}
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
}

export default DetailedTimePicker;
