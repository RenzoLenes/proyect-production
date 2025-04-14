"use client";

import { useConfigStore } from "@/lib/store/configStore";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState, useCallback } from "react";
import { hslToHex } from "@/lib/utils/colorUtils";

export const Customization = () => {
  const {
    company,
    theme,
    colors,
    setCompany,
    setTheme,
    setColors,
    resetColors,
  } = useConfigStore();

  const [tempLogo, setTempLogo] = useState(company.logo);

  const handleColorChange = (type: 'primary' | 'accent' | 'background' | 'foreground', hex: string) => {
    setColors({ [type]: hex });
  };

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newLogo = reader.result as string;
        setTempLogo(newLogo);
        setCompany({ logo: newLogo });
      };
      reader.readAsDataURL(file);
    }
  }, [setCompany]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Personalización de la Plataforma
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre de la Empresa</Label>
            <Input
              value={company.name}
              onChange={(e) => setCompany({ name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Logo de la Empresa</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 border-2 border-dashed rounded-lg flex items-center justify-center">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt="Logo"
                    className="max-h-full object-contain"
                  />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <Label
                  htmlFor="logo-upload"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                >
                  Subir Logo
                </Label>
                {company.logo && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCompany({ logo: "" })}
                  >
                    Eliminar Logo
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tema</Label>
            <Select
              value={theme}
              onValueChange={(value) => setTheme(value as typeof theme)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Oscuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Color Primario</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={hslToHex(colors.primary)}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={hslToHex(colors.primary)}
                onChange={(e) => handleColorChange('primary', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color de Acento</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={hslToHex(colors.accent)}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={hslToHex(colors.accent)}
                onChange={(e) => handleColorChange('accent', e.target.value)}
              />
            </div>
          </div>


          <div className="space-y-2">
            <Label>Color de Background</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={hslToHex(colors.background || '')}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={hslToHex(colors.accent)}
                onChange={(e) => handleColorChange('background', e.target.value)}
              />
            </div>
          </div>



          <div className="space-y-2">
            <Label>Color de Foreground</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={hslToHex(colors.foreground || '')}
                onChange={(e) => handleColorChange('foreground', e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={hslToHex(colors.accent)}
                onChange={(e) => handleColorChange('foreground', e.target.value)}
              />
            </div>
          </div>

          <Button variant="outline" onClick={resetColors}>
            Restablecer Colores por Defecto
          </Button>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Vista Previa</h3>
            <div
              className={`p-4 rounded-lg ${theme === "dark"
                ? "bg-zinc-900 text-white"
                : "bg-white"
                }`}
            >
              <div className="flex items-center gap-4 mb-4">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt="Logo"
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-accent flex items-center justify-center">
                    <span className="text-3xl font-semibold text-primary">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">
                    Cliente
                  </p>
                  <h4 className="font-medium">{company.name}</h4>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};