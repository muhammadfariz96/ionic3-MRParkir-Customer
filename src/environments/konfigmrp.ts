export interface User{
    email: string;
    password: string;
}

export interface Profile{
    fullname: string;
    nokendaraan: string;
    nohp: string;
    saldo : 0;
    TNKB: string;
}

export interface Token{
    TokenHarian: string;
    TokenPaket: string;
    PosisiRotasi: string;
    StatusRotasi: string;
}

export interface Tarif{
    Judul: string;
    KetTarif: string;
    TarifParkir: string;
}

export interface Transaksi{
    DurasiParkir: string;
    NoHP: string;
    NoKavling: string;
    NoKen : string;
    NoToken: string;
    NoTransaksi: string;
    Status: string;
    TglDatang : string;
    TglKeluar : string;
    TotalBiaya: string;
    UID: string;
    WktTiba: string;
    WktKeluar : string;
    unixTiba: string;
    unixKeluar : string;
    StatusTransaksi :string;
}

export interface DurasiSekarang{
    durasi :string;
    biaya: 0;
}

export interface Kavling{
    Nama :string;
    Ptersedia :0;
    Status :string;
    Value :string;
}

export interface Pendapatan{
    TotalDeposit :0;
}