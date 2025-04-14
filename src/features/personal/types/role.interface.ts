export interface Role{
    rol_id: number; 
    rol_nombre: string; // varchar (50)
    rol_descripcion?: string | null; // varchar (500)
    dashboard?: boolean | null; // varchar (1)
    production?: boolean | null; // varchar (1)
    suppliers?: boolean | null; // varchar (1)
    transport?: boolean | null; // varchar (1)
    config?: boolean | null; // varchar (1)
    rol_activo?: boolean | null; // varchar (1)
    fecha_creacion?: Date | null; // datetime
}

