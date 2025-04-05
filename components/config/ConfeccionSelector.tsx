// components/config/ConfeccionSelector.tsx
"use client";

import { useConfigStore } from "@/lib/store/configStore";
import { useEffect, useState } from "react";
import { getAllTipos } from "@/actions/tipo-confeccion/crud-tipo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const TipoConfeccionSelector = () => {
  const { tipoConfeccion, setTipoConfeccion } = useConfigStore();
  const [tipos, setTipos] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    const loadTipos = async () => {
      const tiposFromDB = await getAllTipos();
      setTipos(tiposFromDB.map(t => ({
        value: t.pro_codtic,
        label: t.pro_nomtic
      })));
    };
    loadTipos();
  }, []);

  return (
    <Select
      value={tipoConfeccion}
      onValueChange={(value: string) => {
        setTipoConfeccion(value); // Actualiza el store global
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Tipo confección" />
      </SelectTrigger>
      <SelectContent>
        {tipos.map((tipo) => (
          <SelectItem key={tipo.value} value={tipo.value}>
            {tipo.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};