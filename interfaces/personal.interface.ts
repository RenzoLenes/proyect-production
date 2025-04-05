export interface Personal {
    pro_codper: string; // tdt_idcodigo_anexo (asumo que es un string)
    pro_nomper: string; // tdt_nombre_anexo (asumo que es un string)
    pro_intext: string; // varchar (7)
    pro_codubi: string; // tdt_idubigeo (asumo que es un string)
    pro_dirper: string; // varchar (250)
    pro_telper: string; // varchar (15)
    pro_booven: string; // varchar (1)
    pro_booalm: string; // varchar (1)
    pro_boopro: string; // varchar (1)
    pro_booadm: string; // varchar (1)
    pro_estper: string; // tdt_estado_anexo (asumo que es un string)
    pro_codare: string | null; // varchar (5), nullable
    pro_codcar: string | null; // varchar (5), nullable
    pro_apeper: string | null; // varchar (500), nullable
}