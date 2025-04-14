import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { getRoles, updateRole, createRole, deleteRole } from "@/features/personal/actions/crud-roles";
import { Role } from "@/features/personal/types/role.interface";
import { AlertCircle, CheckCircle, Loader2, Trash2 } from "lucide-react";

export const RolesPermissions = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [modifiedRoles, setModifiedRoles] = useState<Record<number, Partial<Role>>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, isError: boolean } | null>(null);
    const [newRoleDialogOpen, setNewRoleDialogOpen] = useState(false);
    const [newRole, setNewRole] = useState<Omit<Role, 'rol_id'>>({
        rol_nombre: '',
        dashboard: false,
        production: false,
        suppliers: false,
        transport: false,
        config: false
    });
    const [isCreatingRole, setIsCreatingRole] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Cargar roles al montar el componente
    useEffect(() => {
        fetchRoles();
    }, []);

    // Resetear el formulario cuando se abre el diálogo de nuevo rol
    useEffect(() => {
        if (newRoleDialogOpen) {
            setNewRole({
                rol_nombre: '',
                dashboard: false,
                production: false,
                suppliers: false,
                transport: false,
                config: false
            });
        }
    }, [newRoleDialogOpen]);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const rolesData = await getRoles();
            setRoles(rolesData);
        } catch (error) {
            console.error("Error al cargar roles:", error);
            setMessage({ text: "No se pudieron cargar los roles", isError: true });
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambios en los permisos considerando el valor original
    const handlePermissionChange = (roleId: number, permission: keyof Role, value: boolean) => {
        // Encontrar el rol original
        const originalRole = roles.find(r => r.rol_id === roleId);
        if (!originalRole) return;

        // Verificar si el nuevo valor es igual al valor original
        const isValueSameAsOriginal = value === !!originalRole[permission];

        setModifiedRoles(prev => {
            // Crear una copia del estado anterior
            const updatedModifications = { ...prev };

            // Si el valor es igual al original, eliminar la propiedad del objeto de modificaciones
            if (isValueSameAsOriginal) {
                if (updatedModifications[roleId]) {
                    const { [permission]: _, ...rest } = updatedModifications[roleId];

                    // Si no quedan más propiedades modificadas, eliminar el rol completo
                    if (Object.keys(rest).length === 0) {
                        const { [roleId]: __, ...remainingRoles } = updatedModifications;
                        return remainingRoles;
                    }

                    // Actualizar solo con las propiedades restantes
                    updatedModifications[roleId] = rest;
                }
            } else {
                // Si el valor es diferente, actualizar el objeto de modificaciones
                updatedModifications[roleId] = {
                    ...updatedModifications[roleId],
                    [permission]: value
                };
            }

            return updatedModifications;
        });
    };

    // Manejar cambios en el nuevo rol
    const handleNewRoleChange = (field: keyof Omit<Role, 'rol_id'>, value: any) => {
        setNewRole(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Guardar todos los cambios
    const saveChanges = async () => {
        if (Object.keys(modifiedRoles).length === 0) {
            setMessage({ text: "No hay modificaciones para guardar", isError: false });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            const updatePromises = Object.entries(modifiedRoles).map(([roleId, changes]) => {
                const role = roles.find(r => r.rol_id === Number(roleId));
                if (!role) return Promise.resolve();

                const updatedRole = { ...role, ...changes };
                return updateRole(updatedRole);
            });

            await Promise.all(updatePromises);

            // Actualizar el estado local con los roles actualizados
            const updatedRoles = roles.map(role => {
                const changes = modifiedRoles[role.rol_id];
                return changes ? { ...role, ...changes } : role;
            });

            setRoles(updatedRoles);
            setModifiedRoles({});
            setMessage({ text: "Los permisos se actualizaron correctamente", isError: false });

            // Limpiar mensaje después de 3 segundos
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error al guardar cambios:", error);
            setMessage({ text: "No se pudieron guardar los cambios", isError: true });
        } finally {
            setIsSaving(false);
        }
    };

    // Crear un nuevo rol
    const handleCreateRole = async () => {
        if (!newRole.rol_nombre.trim()) {
            setMessage({ text: "El nombre del rol es obligatorio", isError: true });
            return;
        }

        setIsCreatingRole(true);
        try {
            const createdRole = await createRole(newRole);
            setRoles(prev => [...prev, createdRole]);
            setNewRoleDialogOpen(false);
            setNewRole({
                rol_nombre: '',
                dashboard: false,
                production: false,
                suppliers: false,
                transport: false,
                config: false
            });
            setMessage({ text: "Rol creado correctamente", isError: false });

            // Limpiar mensaje después de 3 segundos
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error al crear rol:", error);
            setMessage({ text: "No se pudo crear el rol", isError: true });
        } finally {
            setIsCreatingRole(false);
        }
    };

    // Eliminar un rol
    const handleDeleteRole = async () => {
        if (!roleToDelete) return;

        setIsDeleting(true);
        try {
            await deleteRole(roleToDelete.rol_id);
            setRoles(prev => prev.filter(role => role.rol_id !== roleToDelete.rol_id));

            // También eliminamos cualquier modificación pendiente para este rol
            if (modifiedRoles[roleToDelete.rol_id]) {
                setModifiedRoles(prev => {
                    const { [roleToDelete.rol_id]: _, ...rest } = prev;
                    return rest;
                });
            }

            setDeleteDialogOpen(false);
            setRoleToDelete(null);
            setMessage({ text: "Rol eliminado correctamente", isError: false });

            // Limpiar mensaje después de 3 segundos
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error al eliminar rol:", error);
            setMessage({ text: "No se pudo eliminar el rol", isError: true });
        } finally {
            setIsDeleting(false);
        }
    };

    // Abrir diálogo de confirmación para eliminar un rol
    const openDeleteDialog = (role: Role) => {
        setRoleToDelete(role);
        setDeleteDialogOpen(true);
    };

    // Calcular el valor actual de un permiso (considerando cambios pendientes)
    const getPermissionValue = (role: Role, permission: keyof Role) => {
        const roleChanges = modifiedRoles[role.rol_id] || {};
        return roleChanges[permission] !== undefined ?
            !!roleChanges[permission] :
            !!role[permission];
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Cargando roles...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Gestión de Roles</h2>
                <div className="flex gap-2">
                    <Button
                        onClick={saveChanges}
                        disabled={isSaving || Object.keys(modifiedRoles).length === 0}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : "Guardar Cambios"}
                    </Button>
                    <Button onClick={() => setNewRoleDialogOpen(true)}>Nuevo Rol</Button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-md flex items-center ${message.isError
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-green-100 text-green-700 border border-green-200"
                    }`}>
                    {message.isError ? (
                        <AlertCircle className="h-5 w-5 mr-2" />
                    ) : (
                        <CheckCircle className="h-5 w-5 mr-2" />
                    )}
                    {message.text}
                </div>
            )}

            {roles.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No hay roles configurados en el sistema.</p>
                    <Button
                        className="mt-4"
                        onClick={() => setNewRoleDialogOpen(true)}
                    >
                        Crear primer rol
                    </Button>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rol</TableHead>
                            <TableHead>Dashboard</TableHead>
                            <TableHead>Producción</TableHead>
                            <TableHead>Proveedores</TableHead>
                            <TableHead>Transporte</TableHead>
                            <TableHead>Configuración</TableHead>
                            <TableHead className="w-[80px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.rol_id}>
                                <TableCell className="font-medium">
                                    {role.rol_nombre}
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={getPermissionValue(role, 'dashboard')}
                                        onCheckedChange={(checked) =>
                                            handlePermissionChange(role.rol_id, 'dashboard', checked)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={getPermissionValue(role, 'production')}
                                        onCheckedChange={(checked) =>
                                            handlePermissionChange(role.rol_id, 'production', checked)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={getPermissionValue(role, 'suppliers')}
                                        onCheckedChange={(checked) =>
                                            handlePermissionChange(role.rol_id, 'suppliers', checked)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={getPermissionValue(role, 'transport')}
                                        onCheckedChange={(checked) =>
                                            handlePermissionChange(role.rol_id, 'transport', checked)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={getPermissionValue(role, 'config')}
                                        onCheckedChange={(checked) =>
                                            handlePermissionChange(role.rol_id, 'config', checked)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openDeleteDialog(role)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Modal para crear nuevo rol */}
            <Dialog open={newRoleDialogOpen} onOpenChange={setNewRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Rol</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="roleName">Nombre del Rol</Label>
                            <Input
                                id="roleName"
                                value={newRole.rol_nombre}
                                onChange={(e) => handleNewRoleChange('rol_nombre', e.target.value)}
                                placeholder="Ej: Administrador"
                            />
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Permisos</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="newDashboard"
                                        checked={!!newRole.dashboard}
                                        onCheckedChange={(checked) => {
                                            handleNewRoleChange('dashboard', checked);
                                        }}
                                    />
                                    <Label htmlFor="newDashboard">Dashboard</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="newProduction"
                                        checked={!!newRole.production}
                                        onCheckedChange={(checked) => {
                                            handleNewRoleChange('production', checked);
                                        }}
                                    />
                                    <Label htmlFor="newProduction">Producción</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="newSuppliers"
                                        checked={!!newRole.suppliers}
                                        onCheckedChange={(checked) => {
                                            handleNewRoleChange('suppliers', checked);
                                        }}
                                    />
                                    <Label htmlFor="newSuppliers">Proveedores</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="newTransport"
                                        checked={!!newRole.transport}
                                        onCheckedChange={(checked) => {
                                            handleNewRoleChange('transport', checked);
                                        }}
                                    />
                                    <Label htmlFor="newTransport">Transporte</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="newConfig"
                                        checked={!!newRole.config}
                                        onCheckedChange={(checked) => {
                                            handleNewRoleChange('config', checked);
                                        }}
                                    />
                                    <Label htmlFor="newConfig">Configuración</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewRoleDialogOpen(false)}>Cancelar</Button>
                        <Button
                            onClick={handleCreateRole}
                            disabled={isCreatingRole || !newRole.rol_nombre.trim()}
                        >
                            {isCreatingRole ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creando...
                                </>
                            ) : "Crear Rol"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal para confirmar eliminación */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Eliminar Rol</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>¿Está seguro que desea eliminar el rol <strong>{roleToDelete?.rol_nombre}</strong>?</p>
                        <p className="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteRole}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Eliminando...
                                </>
                            ) : "Eliminar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};