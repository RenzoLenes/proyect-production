-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permiso" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioRol" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoConfeccion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "TipoConfeccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proceso" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipoConfeccionId" INTEGER NOT NULL,

    CONSTRAINT "Proceso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subproceso" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "procesoId" INTEGER NOT NULL,
    "porDefectoInterno" BOOLEAN NOT NULL,

    CONSTRAINT "Subproceso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bloque" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Bloque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloqueSubproceso" (
    "id" SERIAL NOT NULL,
    "bloqueId" INTEGER NOT NULL,
    "subprocesoId" INTEGER NOT NULL,
    "tipoEjecucion" TEXT NOT NULL,

    CONSTRAINT "BloqueSubproceso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenEnvio" (
    "id" SERIAL NOT NULL,
    "fechaSalida" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdenEnvio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenEnvioBloque" (
    "id" SERIAL NOT NULL,
    "ordenEnvioId" INTEGER NOT NULL,
    "bloqueId" INTEGER NOT NULL,

    CONSTRAINT "OrdenEnvioBloque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeguimientoTransporte" (
    "id" SERIAL NOT NULL,
    "ordenEnvioId" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeguimientoTransporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PermisoToRol" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PermisoToRol_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "_PermisoToRol_B_index" ON "_PermisoToRol"("B");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipoConfeccion" ADD CONSTRAINT "TipoConfeccion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proceso" ADD CONSTRAINT "Proceso_tipoConfeccionId_fkey" FOREIGN KEY ("tipoConfeccionId") REFERENCES "TipoConfeccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subproceso" ADD CONSTRAINT "Subproceso_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloqueSubproceso" ADD CONSTRAINT "BloqueSubproceso_bloqueId_fkey" FOREIGN KEY ("bloqueId") REFERENCES "Bloque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloqueSubproceso" ADD CONSTRAINT "BloqueSubproceso_subprocesoId_fkey" FOREIGN KEY ("subprocesoId") REFERENCES "Subproceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenEnvioBloque" ADD CONSTRAINT "OrdenEnvioBloque_ordenEnvioId_fkey" FOREIGN KEY ("ordenEnvioId") REFERENCES "OrdenEnvio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenEnvioBloque" ADD CONSTRAINT "OrdenEnvioBloque_bloqueId_fkey" FOREIGN KEY ("bloqueId") REFERENCES "Bloque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguimientoTransporte" ADD CONSTRAINT "SeguimientoTransporte_ordenEnvioId_fkey" FOREIGN KEY ("ordenEnvioId") REFERENCES "OrdenEnvio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermisoToRol" ADD CONSTRAINT "_PermisoToRol_A_fkey" FOREIGN KEY ("A") REFERENCES "Permiso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermisoToRol" ADD CONSTRAINT "_PermisoToRol_B_fkey" FOREIGN KEY ("B") REFERENCES "Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;
