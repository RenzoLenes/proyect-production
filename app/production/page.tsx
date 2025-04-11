"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, QrCode, Filter, Menu, ChevronLeft, ChevronRight, Loader2, FolderX } from "lucide-react";
import SideBar from "@/components/sidebar";
import {
  obtenerMovimientosPendientes
} from '@/actions/procesoc/crud-movprocesoc';

import { MovimientoProcesoResultado } from '@/interfaces/movproceso.interface';
import { ParametrosMovimiento } from '@/actions/procesoc/crud-movprocesoc';
import {
  getProcesosByTipoConfeccion,
} from '../../actions/procesos/crud-proceso';
import { BlockCard } from "@/components/production/BlockCard";
import { getPersonalByTipo } from "@/actions/personal/crud-personal";
import { Personal } from "@/interfaces/personal.interface";
import { useConfigStore } from "@/lib/store/configStore";
import { TipoConfeccionSelector } from "@/components/config/ConfeccionSelector";
import { BlockOperationDialog } from "@/components/production/BlockOperationDialog";
import { Block } from "@/types/block";


const getBlockId = (movimiento: MovimientoProcesoResultado) => {
  return `${movimiento.codigo_folder}-${movimiento.serie}-${movimiento.numero}-${movimiento.item}`;
};
export default function ProductionPage() {
  // Pagination and state management
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [movimientos, setMovimientos] = useState<MovimientoProcesoResultado[]>([]);
  const [procesos, setProcesos] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState<Block[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [operators, setOperators] = useState<Personal[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { tipoConfeccion } = useConfigStore();
  const [procesosTabs, setProcesosTabs] = useState<Array<{ value: string, label: string }>>([]);
  const { initializeTipoConfeccion } = useConfigStore();




  useEffect(() => {
    // Cuando cargues los tipos de confección
    initializeTipoConfeccion('001'); // O el valor por defecto que prefieras
  }, []);

  useEffect(() => {
    const loadProcesosTabs = async () => {
      try {
        const procesos = await getProcesosByTipoConfeccion(tipoConfeccion);

        const tabsDinamicos = [
          { value: 'all', label: 'Todos' }, // Tab "Todos" siempre visible
          ...procesos.map(proceso => ({
            value: proceso.pro_codpro,
            label: proceso.pro_nompro
          }))
        ];

        setProcesosTabs(tabsDinamicos);
      } catch (error) {
        console.error("Error cargando procesos:", error);
        setProcesosTabs([{ value: 'all', label: 'Todos' }]); // Al menos mostrar "Todos"
      }
    };

    loadProcesosTabs();
  }, [tipoConfeccion]); // Se ejecuta cuando 

  const [filters, setFilters] = useState<ParametrosMovimiento>({
    tipoConfeccion: tipoConfeccion, // Usa el valor del store
    proceso: "(TODOS)",
    calidad: "(TODOS)",
    tipo: "(TODOS)",
    color: "(TODOS)",
    costurero: "(TODOS)",
    tipoModa: "001"
  });


  // Add a function to handle block selection
  const handleBlockSelection = (block: Block) => {
    setSelectedBlocks(prev =>
      prev.some(b => b.id === block.id)
        ? prev.filter(b => b.id !== block.id)
        : [...prev, block]
    );
  };

  // Agrupar movimientos por bloque (serie-numero-item)
  const groupedBlocks = useMemo(() => {
    const groups: Record<string, MovimientoProcesoResultado[]> = {};

    movimientos.forEach(movimiento => {
      const blockId = getBlockId(movimiento);
      if (!groups[blockId]) {
        groups[blockId] = [];
      }
      groups[blockId].push(movimiento);
    });

    return Object.entries(groups).map(([id, movs]) => ({
      id,
      movimientos: movs,
      procesoActual: movs[0].nombre_proceso,
      codigoProceso: movs[0].codigo_proceso,
      procesoAnterior: movs[0].proceso_ant,
      procesoSuperior: movs[0].proceso_sup,
      // Añadiendo los campos requeridos (asumiendo que están en MovimientoProcesoResultado)
      pro_codtic: tipoConfeccion, // Valor por defecto si no existe
      pro_codfol: movs[0].codigo_folder,  // Valor por defecto si no existe
      pro_numser: movs[0].serie, // Valor por defecto si no existe
      pro_numdoc: movs[0].numero, // Valor por defecto si no existe
      pro_itemov: Number(movs[0].item) // Usando Number()     // Valor por defecto si no existe

    }));
  }, [movimientos, tipoConfeccion]);

  // Filtrar bloques
  const filteredBlocks = useMemo(() => {
    return groupedBlocks.filter(block =>
      (activeTab === 'all' || block.codigoProceso === activeTab) &&
      (searchTerm === '' ||
        block.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.movimientos.some(m =>
          m.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.activo.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );
  }, [groupedBlocks, activeTab, searchTerm]);



  // Paginación de bloques
  const totalBlocks = filteredBlocks.length;
  const totalPages = Math.ceil(totalBlocks / itemsPerPage);
  const indexOfLastBlock = currentPage * itemsPerPage;
  const indexOfFirstBlock = indexOfLastBlock - itemsPerPage;
  const currentBlocks = filteredBlocks.slice(indexOfFirstBlock, indexOfLastBlock);

  // Fetch movimientos based on filters
  const fetchMovimientos = async () => {

    try {
      setLoading(true);
      const fetchedMovimientos = await obtenerMovimientosPendientes(filters);

      if (fetchedMovimientos && Array.isArray(fetchedMovimientos)) {
        setMovimientos(fetchedMovimientos);
      } else {
        console.error("La respuesta no es un array válido:", fetchedMovimientos);
        setMovimientos([]);
      }
    } catch (error) {
      console.error("Error fetching movimientos:", error);
      setMovimientos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        // 'INTERNO' o 'EXTERNO' según necesites
        const fetchedOperators = await getPersonalByTipo('INTERNO');
        setOperators(fetchedOperators);
        console.log("Fetched operators:", fetchedOperators);
      } catch (error) {
        console.error("Error fetching operators:", error);
        setOperators([]);
      }
    };

    fetchOperators();
  }, []);

  // Fetch processes on component mount
  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const fetchedProcesos = await getProcesosByTipoConfeccion(tipoConfeccion);
        setProcesos(fetchedProcesos);
      } catch (error) {
        console.error("Error fetching processes:", error);
      }
    };

    fetchProcesses();
  }, [tipoConfeccion]);

  // Fetch movimientos when filters change
  useEffect(() => {
    fetchMovimientos();
  }, [filters]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, tipoConfeccion }));
    fetchMovimientos(); // Esto se disparará cuando cambie tipoConfeccion
  }, [tipoConfeccion]); // Agrega esta dependencia

  // Filtering logic
  const filteredMovimientos = movimientos
    .filter((movimiento) =>
      activeTab === 'all' ||
      movimiento.codigo_proceso === activeTab
    )
    .filter((movimiento) =>
      searchTerm === '' ||
      movimiento.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movimiento.activo.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination calculations
  const indexOfLastMovimiento = currentPage * itemsPerPage;
  const indexOfFirstMovimiento = indexOfLastMovimiento - itemsPerPage;

  // Pagination handlers
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset pagination when changing tabs or search
  useEffect(() => {
    setCurrentPage(1);
    setSelectedBlocks([]);
  }, [activeTab, searchTerm]);

  // Toggle sidebar
  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);

  // Edit and process movement handlers
  const handleEditMovimiento = (movimiento: MovimientoProcesoResultado) => {
    // Implement edit logic
    console.log("Editing movimiento:", movimiento);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SideBar isMobileOpen={isMobileOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-8 lg:ml-64 transition-all duration-300 ease-in-out">
        {/* Top Bar */}
        <div className="bg-background border-b sticky top-0 z-10">

          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-accent">
                  <Menu className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Movimientos de Producción</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Seguimiento de procesos de producción
                  </p>
                </div>

              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <TipoConfeccionSelector />
                <Button variant="outline" size="icon">
                  <QrCode className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Search bar */}
            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por referencia o ID"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-2 sm:px-4 pt-4 sm:pt-8 max-w-full">
          <Tabs
            defaultValue="all"
            className="space-y-4 sm:space-y-8"
            onValueChange={(value) => setActiveTab(value)}
          >
            <div className="overflow-x-auto">
              <TabsList className="flex w-full">
                {procesosTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm whitespace-nowrap">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {procesosTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <ScrollArea className="h-[calc(100vh-280px)] sm:h-[calc(100vh-270px)]">
                  <div className="space-y-3 sm:space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-8 sm:py-12 gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="font-medium">Cargando bloques...</span>
                      </div>
                    ) : currentBlocks.length === 0 ? (
                      <div className="text-center py-8 sm:py-12 text-muted-foreground">
                        <FolderX className="h-8 w-8 mx-auto mb-2" />
                        No se encontraron bloques
                      </div>
                    ) : (
                      currentBlocks.map((block) => (
                        <BlockCard
                          key={block.id}
                          bloque={block}
                          isSelected={selectedBlocks.some(b => b.id === block.id)}
                          onSelect={() => handleBlockSelection(block)}
                          onEditSubproceso={(blockId, subprocesoId) => {
                            console.log(`Editando subproceso ${subprocesoId} en bloque ${blockId}`);
                            // Lógica para editar subproceso
                          }}
                          fetchBloques={fetchMovimientos}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Pagination controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 sm:mt-6 pb-24 sm:pb-12">
                  <div className="text-xs sm:text-sm text-muted-foreground order-3 sm:order-1">
                    Mostrando {indexOfFirstBlock + 1}-{Math.min(indexOfLastBlock, totalBlocks)} de {totalBlocks} bloques
                  </div>

                  <div className="flex items-center space-x-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="hidden sm:flex items-center space-x-1">
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        let pageNum;

                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    {/* Mobile pagination indicator */}
                    <div className="sm:hidden text-sm font-medium">
                      {currentPage} / {totalPages}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2 order-2 sm:order-3">
                    <span className="text-xs sm:text-sm">Por página:</span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-16 h-8">
                        <SelectValue placeholder={itemsPerPage.toString()} />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 20, 50].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Batch operation bottom bar */}
        {selectedBlocks.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 sm:p-4 z-20">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-2 sm:px-8">
              <span className="text-xs sm:text-sm">
                {selectedBlocks.length} {selectedBlocks.length === 1 ? "bloque seleccionado" : "bloques seleccionados"}
              </span>
              <Button
                onClick={() => setIsDialogOpen(true)}
                disabled={selectedBlocks.length === 0}
                className="w-full sm:w-auto"
              >
                Registrar Operación
              </Button>

              <BlockOperationDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title="Registrar operación"
                blocks={selectedBlocks}
                operators={operators}
                setSelectedBlocks={setSelectedBlocks}
                fetchData={fetchMovimientos}
              />

            </div>
          </div>
        )}

      </div>
    </div>
  );
}