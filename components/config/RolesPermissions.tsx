import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "../ui/button";
import { mockRoles } from "@/data/mockRole";



export const RolesPermissions = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Gestión de Roles</h2>
                <Button>Nuevo Rol</Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Rol</TableHead>
                        <TableHead>Dashboard</TableHead>
                        <TableHead>Producción</TableHead>
                        <TableHead>Reportes</TableHead>
                        <TableHead>Configuración</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockRoles.map((role) => (
                        <TableRow key={role.name}>
                            <TableCell className="font-medium">
                                {role.name}
                            </TableCell>
                            <TableCell>
                                <Switch checked={role.permissions.dashboard} />
                            </TableCell>
                            <TableCell>
                                <Switch checked={role.permissions.production} />
                            </TableCell>
                            <TableCell>
                                <Switch checked={role.permissions.suppliers} />
                            </TableCell>
                            <TableCell>
                                <Switch checked={role.permissions.config} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};