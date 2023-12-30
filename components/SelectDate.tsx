'use client'
import { getDatesFromCinema } from "@/app/scrap";
import { useEffect, useState } from "react";

interface ComponentProps {
  cinemaKey: string;
  selectedDate: string;
  changeDate: (value: string) => void;
}

async function getDatesFromCinemaAsync(cinema: string) {
  const dates = await getDatesFromCinema(cinema)

  return dates
}

const SelectDate = ({ cinemaKey, selectedDate, changeDate }: ComponentProps) => {
  const [dates, setDates] = useState<string[]>([])

  useEffect(() => {
    async function getDates() {
      const dates = await getDatesFromCinemaAsync(cinemaKey)

      setDates(dates)
    }

    getDates()
  }, [])

  return (
    <select
      className="bg-white dark:bg-black border rounded p-2"
      onChange={(event) => changeDate(event.target.value)}
      value={selectedDate}
    >
      {dates.map((date: any, index: number) => (
        <option
          key={date + index}
          value={date}
        >
          {date}
        </option>
      ))}
    </select>
  )
}

export default SelectDate