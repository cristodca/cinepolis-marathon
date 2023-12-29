"use client";
import { getCinemas } from "@/app/scrap";
import { useEffect, useState } from "react";

async function getCinemasFromAPI() {
  const cinemas = await getCinemas();

  return cinemas;
}

interface ComponentProps {
  cinemaKey: string;
  changeCinema: (value: string) => void;
}

const SelectCinema = ({ cinemaKey, changeCinema }: ComponentProps) => {
  const [cinemas, setCinemas] = useState<any>([]);

  useEffect(() => {
    async function getCinemas() {
      const cinemas = await getCinemasFromAPI();

      setCinemas(cinemas);
    }

    getCinemas();
  }, []);

  return (
    <select className="bg-white dark:bg-black border rounded p-2" onChange={(event) => changeCinema(event.target.value)}>
      {cinemas.map((cinema: any) => (
        <option key={cinema.Key} value={cinema.Key} selected={cinema.Key === cinemaKey}>
          {cinema.Name}
        </option>
      ))}
    </select>
  );
};

export default SelectCinema;
