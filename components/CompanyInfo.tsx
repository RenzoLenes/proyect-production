'use client';

import { useConfigStore } from "@/lib/store/configStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";


interface CompanyInfoProps {
    mobile?: boolean;
}


export const CompanyInfo = ({ mobile = false }: CompanyInfoProps) => {

    const { company, setCompany } = useConfigStore();
    const [showDialog, setShowDialog] = useState(false);
    const [tempCompany, setTempCompany] = useState(company);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempCompany({ ...tempCompany, logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <button
                onClick={() => {
                    setTempCompany(company);
                    setShowDialog(true);
                }}
                className="flex items-center gap-3 mb-8 w-full hover:bg-accent p-2 rounded-lg transition-colors"
            >
                {company.logo ? (
                    <img
                        src={company.logo}
                        alt="Logo"
                        className="h-8 w-8 object-contain rounded"
                    />
                ) : (
                    <div className="h-8 w-8 rounded bg-accent flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                            {company.name.charAt(0)}
                        </span>
                    </div>
                )}
                {!mobile && (
                    <div className="text-left">
                        <p className="text-sm text-muted-foreground">Cliente</p>
                        <p className="font-medium truncate">{company.name}</p>
                    </div>
                )}

            </button>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Información de la Empresa</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="company-name">Nombre</Label>
                            <Input
                                id="company-name"
                                value={tempCompany.name}
                                onChange={(e) => setTempCompany({ ...tempCompany, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Logo</Label>
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 border-2 border-dashed rounded-lg flex items-center justify-center">
                                    {tempCompany.logo ? (
                                        <img
                                            src={tempCompany.logo}
                                            alt="Logo"
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 rounded bg-primary/10 flex items-center justify-center">
                                            <span className="text-3xl font-semibold text-primary">
                                                {tempCompany.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
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
                                    {tempCompany.logo && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setTempCompany({ ...tempCompany, logo: "" })}
                                        >
                                            Eliminar Logo
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={() => {
                            setCompany(tempCompany);
                            setShowDialog(false);
                        }}>
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};