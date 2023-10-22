

export interface ItemOperacion {
    id_operacion:number,
    code: string;
    nombreProducto: string;
    code: string;
    sCj: number;
    sPz: number;
    sTotalPz: number;
    rCj: number;
    rPz: number;
    rTotalPz: number;
    ventaPz: number;
    saldo: number;
    precio_compra:number;
    mls: number;
}

export interface Operation {
    id: number;
    repartidor: number;
    cobro: number;
    utilidad: number;
    comision: number;
    totalMl: number;
    items?:Array<itemOperacion>;
    date: string;
}