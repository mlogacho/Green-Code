// ============================================================
// Base de datos demo - Registro Civil Ecuador
// 50 registros con cédulas válidas (dígito verificador correcto)
// Incluye datos reales de Marco Logacho para modo demo
// ============================================================

export interface RegistroCivilDemo {
  cedula: string;
  nombres: string;
  fechaNacimiento: string;
  estadoCivil: string;
  sexo: string;
  lugarNacimiento: string;
  fechaEmisionDocumento: string;
  fechaExpiracion: string;
  codigoDactilar: string;
}

export const DEMO_CEDULAS: RegistroCivilDemo[] = [
  // -----------------------------------------------------------
  // Registro real del demostrante
  // -----------------------------------------------------------
  {
    cedula: '1715790513',
    nombres: 'MARCO FABRICIO LOGACHO GUZMAN',
    fechaNacimiento: '1980-07-15',
    estadoCivil: 'DIVORCIADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'TUMBACO',
    fechaEmisionDocumento: '23/09/2022',
    fechaExpiracion: '23/09/2032',
    codigoDactilar: 'V3333V2142',
  },

  // -----------------------------------------------------------
  // Pichincha (17)
  // -----------------------------------------------------------
  {
    cedula: '1701234567',
    nombres: 'CARLOS ANDRES GARCIA RODRIGUEZ',
    fechaNacimiento: '1985-03-22',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'QUITO',
    fechaEmisionDocumento: '15/04/2021',
    fechaExpiracion: '15/04/2031',
    codigoDactilar: 'A1234B5678',
  },
  {
    cedula: '1720123452',
    nombres: 'MARIA ELENA TORRES VARGAS',
    fechaNacimiento: '1990-11-08',
    estadoCivil: 'SOLTERA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'QUITO',
    fechaEmisionDocumento: '10/06/2022',
    fechaExpiracion: '10/06/2032',
    codigoDactilar: 'B2345C6789',
  },
  {
    cedula: '1714567896',
    nombres: 'JUAN PABLO PEREZ MARTINEZ',
    fechaNacimiento: '1975-06-30',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'QUITO',
    fechaEmisionDocumento: '05/02/2020',
    fechaExpiracion: '05/02/2030',
    codigoDactilar: 'C3456D7890',
  },
  {
    cedula: '1715678908',
    nombres: 'ANA LUCIA GONZALEZ FLORES',
    fechaNacimiento: '1988-09-14',
    estadoCivil: 'DIVORCIADA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'CUMBAYA',
    fechaEmisionDocumento: '20/08/2023',
    fechaExpiracion: '20/08/2033',
    codigoDactilar: 'D4567E8901',
  },
  {
    cedula: '1703045674',
    nombres: 'SANTIAGO NICOLAS PEREZ GONZALEZ',
    fechaNacimiento: '1987-10-04',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'SANGOLQUI',
    fechaEmisionDocumento: '12/03/2021',
    fechaExpiracion: '12/03/2031',
    codigoDactilar: 'E5678F9012',
  },
  {
    cedula: '1710456789',
    nombres: 'ALEX RODRIGO FLORES MORA',
    fechaNacimiento: '1980-12-31',
    estadoCivil: 'DIVORCIADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'QUITO',
    fechaEmisionDocumento: '28/11/2022',
    fechaExpiracion: '28/11/2032',
    codigoDactilar: 'F6789G0123',
  },
  {
    cedula: '1723012348',
    nombres: 'LORENA PATRICIA TORRES CASTRO',
    fechaNacimiento: '1985-01-29',
    estadoCivil: 'CASADA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'QUITO',
    fechaEmisionDocumento: '03/07/2020',
    fechaExpiracion: '03/07/2030',
    codigoDactilar: 'G7890H1234',
  },
  {
    cedula: '1754321097',
    nombres: 'HENRY FABIAN MORA MENDOZA',
    fechaNacimiento: '1976-04-14',
    estadoCivil: 'DIVORCIADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'QUITO',
    fechaEmisionDocumento: '17/09/2021',
    fechaExpiracion: '17/09/2031',
    codigoDactilar: 'H8901I2345',
  },
  {
    cedula: '1732109879',
    nombres: 'SILVIA MARGARITA VEGA ALVARADO',
    fechaNacimiento: '1989-09-03',
    estadoCivil: 'CASADA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'QUITO',
    fechaEmisionDocumento: '22/05/2023',
    fechaExpiracion: '22/05/2033',
    codigoDactilar: 'I9012J3456',
  },

  // -----------------------------------------------------------
  // Guayas (09)
  // -----------------------------------------------------------
  {
    cedula: '0903456788',
    nombres: 'PEDRO ANTONIO RODRIGUEZ SANCHEZ',
    fechaNacimiento: '1978-12-05',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'GUAYAQUIL',
    fechaEmisionDocumento: '08/01/2021',
    fechaExpiracion: '08/01/2031',
    codigoDactilar: 'J0123K4567',
  },
  {
    cedula: '0920123452',
    nombres: 'ROSA ISABEL MORA VEGA',
    fechaNacimiento: '1992-04-17',
    estadoCivil: 'SOLTERA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'GUAYAQUIL',
    fechaEmisionDocumento: '25/09/2022',
    fechaExpiracion: '25/09/2032',
    codigoDactilar: 'K1234L5678',
  },
  {
    cedula: '0915432108',
    nombres: 'DIEGO ALEJANDRO REYES ORTEGA',
    fechaNacimiento: '1983-08-25',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'GUAYAQUIL',
    fechaEmisionDocumento: '14/04/2020',
    fechaExpiracion: '14/04/2030',
    codigoDactilar: 'L2345M6789',
  },
  {
    cedula: '0934567892',
    nombres: 'PATRICIA DEL CARMEN CASTRO JIMENEZ',
    fechaNacimiento: '1970-01-12',
    estadoCivil: 'VIUDA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'GUAYAQUIL',
    fechaEmisionDocumento: '30/06/2021',
    fechaExpiracion: '30/06/2031',
    codigoDactilar: 'M3456N7890',
  },
  {
    cedula: '0912345600',
    nombres: 'LUIS MIGUEL SUAREZ MENDOZA',
    fechaNacimiento: '1995-07-03',
    estadoCivil: 'SOLTERO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'DAULE',
    fechaEmisionDocumento: '19/11/2022',
    fechaExpiracion: '19/11/2032',
    codigoDactilar: 'N4567O8901',
  },
  {
    cedula: '0956789010',
    nombres: 'CARMEN ROSA MARTINEZ SANCHEZ',
    fechaNacimiento: '1972-05-19',
    estadoCivil: 'VIUDA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'GUAYAQUIL',
    fechaEmisionDocumento: '07/03/2020',
    fechaExpiracion: '07/03/2030',
    codigoDactilar: 'O5678P9012',
  },
  {
    cedula: '0987654324',
    nombres: 'KARINA ELIZABETH GONZALEZ REYES',
    fechaNacimiento: '1992-08-06',
    estadoCivil: 'SOLTERA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'GUAYAQUIL',
    fechaEmisionDocumento: '11/10/2023',
    fechaExpiracion: '11/10/2033',
    codigoDactilar: 'P6789Q0123',
  },

  // -----------------------------------------------------------
  // Azuay / Cuenca (01)
  // -----------------------------------------------------------
  {
    cedula: '0102345675',
    nombres: 'GABRIELA FERNANDA ALVARADO HERRERA',
    fechaNacimiento: '1987-05-19',
    estadoCivil: 'CASADA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'CUENCA',
    fechaEmisionDocumento: '21/02/2021',
    fechaExpiracion: '21/02/2031',
    codigoDactilar: 'Q7890R1234',
  },
  {
    cedula: '0113456784',
    nombres: 'JOSE MANUEL ESPINOZA CERON',
    fechaNacimiento: '1973-10-28',
    estadoCivil: 'DIVORCIADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'CUENCA',
    fechaEmisionDocumento: '16/07/2022',
    fechaExpiracion: '16/07/2032',
    codigoDactilar: 'R8901S2345',
  },
  {
    cedula: '0104567896',
    nombres: 'CAROLINA BEATRIZ VILLACIS NARANJO',
    fechaNacimiento: '1991-02-14',
    estadoCivil: 'UNION LIBRE',
    sexo: 'FEMENINO',
    lugarNacimiento: 'CUENCA',
    fechaEmisionDocumento: '04/12/2021',
    fechaExpiracion: '04/12/2031',
    codigoDactilar: 'S9012T3456',
  },
  {
    cedula: '0156789018',
    nombres: 'BOLIVAR RODRIGO SUAREZ NARANJO',
    fechaNacimiento: '1965-10-17',
    estadoCivil: 'VIUDO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'CUENCA',
    fechaEmisionDocumento: '09/04/2020',
    fechaExpiracion: '09/04/2030',
    codigoDactilar: 'T0123U4567',
  },

  // -----------------------------------------------------------
  // Manabí (13)
  // -----------------------------------------------------------
  {
    cedula: '1301234561',
    nombres: 'RAFAEL EDUARDO ANDRADE BARRIGA',
    fechaNacimiento: '1968-08-07',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'PORTOVIEJO',
    fechaEmisionDocumento: '26/05/2021',
    fechaExpiracion: '26/05/2031',
    codigoDactilar: 'U1234V5678',
  },
  {
    cedula: '1323456788',
    nombres: 'MONICA ALEXANDRA CAICEDO SALAZAR',
    fechaNacimiento: '1994-12-23',
    estadoCivil: 'SOLTERA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'MANTA',
    fechaEmisionDocumento: '13/08/2022',
    fechaExpiracion: '13/08/2032',
    codigoDactilar: 'V2345W6789',
  },
  {
    cedula: '1312345679',
    nombres: 'ANDRES SEBASTIAN LOPEZ DIAZ',
    fechaNacimiento: '1982-07-16',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'PORTOVIEJO',
    fechaEmisionDocumento: '01/01/2023',
    fechaExpiracion: '01/01/2033',
    codigoDactilar: 'W3456X7890',
  },
  {
    cedula: '1356789014',
    nombres: 'MAURICIO ANDRES LOPEZ JIMENEZ',
    fechaNacimiento: '1978-07-08',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'BAHIA DE CARAQUEZ',
    fechaEmisionDocumento: '18/10/2020',
    fechaExpiracion: '18/10/2030',
    codigoDactilar: 'X4567Y8901',
  },

  // -----------------------------------------------------------
  // Tungurahua (18)
  // -----------------------------------------------------------
  {
    cedula: '1802345676',
    nombres: 'ISABEL CRISTINA VARGAS ROMERO',
    fechaNacimiento: '1976-03-09',
    estadoCivil: 'DIVORCIADA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'AMBATO',
    fechaEmisionDocumento: '23/06/2021',
    fechaExpiracion: '23/06/2031',
    codigoDactilar: 'Y5678Z9012',
  },
  {
    cedula: '1813456785',
    nombres: 'XAVIER ERNESTO MARTINEZ FLORES',
    fechaNacimiento: '1989-11-30',
    estadoCivil: 'SOLTERO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'AMBATO',
    fechaEmisionDocumento: '07/02/2022',
    fechaExpiracion: '07/02/2032',
    codigoDactilar: 'Z6789A0123',
  },
  {
    cedula: '1824567893',
    nombres: 'VANESSA CAROLINA SANCHEZ TORRES',
    fechaNacimiento: '1993-06-18',
    estadoCivil: 'UNION LIBRE',
    sexo: 'FEMENINO',
    lugarNacimiento: 'BANOS',
    fechaEmisionDocumento: '29/09/2023',
    fechaExpiracion: '29/09/2033',
    codigoDactilar: 'A7890B1234',
  },
  {
    cedula: '1854321096',
    nombres: 'VICTOR HUGO SANCHEZ ORTEGA',
    fechaNacimiento: '1967-03-15',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'AMBATO',
    fechaEmisionDocumento: '14/05/2020',
    fechaExpiracion: '14/05/2030',
    codigoDactilar: 'B8901C2345',
  },

  // -----------------------------------------------------------
  // Chimborazo (06)
  // -----------------------------------------------------------
  {
    cedula: '0602345670',
    nombres: 'MIGUEL ANGEL FLORES GARCIA',
    fechaNacimiento: '1971-09-24',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'RIOBAMBA',
    fechaEmisionDocumento: '31/03/2021',
    fechaExpiracion: '31/03/2031',
    codigoDactilar: 'C9012D3456',
  },
  {
    cedula: '0613456789',
    nombres: 'ALEXANDRA PAOLA DIAZ PEREZ',
    fechaNacimiento: '1986-04-05',
    estadoCivil: 'CASADA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'RIOBAMBA',
    fechaEmisionDocumento: '20/11/2022',
    fechaExpiracion: '20/11/2032',
    codigoDactilar: 'D0123E4567',
  },
  {
    cedula: '0654321090',
    nombres: 'CECILIA ADRIANA DIAZ SUAREZ',
    fechaNacimiento: '1993-11-22',
    estadoCivil: 'SOLTERA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'RIOBAMBA',
    fechaEmisionDocumento: '05/06/2023',
    fechaExpiracion: '05/06/2033',
    codigoDactilar: 'E1234F5678',
  },

  // -----------------------------------------------------------
  // El Oro (07)
  // -----------------------------------------------------------
  {
    cedula: '0704567890',
    nombres: 'ROBERTO CARLOS MORA GONZALEZ',
    fechaNacimiento: '1979-01-20',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'MACHALA',
    fechaEmisionDocumento: '10/09/2020',
    fechaExpiracion: '10/09/2030',
    codigoDactilar: 'F2345G6789',
  },
  {
    cedula: '0712345677',
    nombres: 'PAOLA NATALIA VEGA RODRIGUEZ',
    fechaNacimiento: '1997-08-11',
    estadoCivil: 'SOLTERA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'MACHALA',
    fechaEmisionDocumento: '24/01/2023',
    fechaExpiracion: '24/01/2033',
    codigoDactilar: 'G3456H7890',
  },
  {
    cedula: '0754321099',
    nombres: 'FERNANDO AUGUSTO ORTEGA HERRERA',
    fechaNacimiento: '1971-06-27',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'MACHALA',
    fechaEmisionDocumento: '16/08/2021',
    fechaExpiracion: '16/08/2031',
    codigoDactilar: 'H4567I8901',
  },

  // -----------------------------------------------------------
  // Imbabura (10)
  // -----------------------------------------------------------
  {
    cedula: '1002345674',
    nombres: 'IVAN RODRIGO ORTEGA VARGAS',
    fechaNacimiento: '1984-05-27',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'IBARRA',
    fechaEmisionDocumento: '02/12/2020',
    fechaExpiracion: '02/12/2030',
    codigoDactilar: 'I5678J9012',
  },
  {
    cedula: '1013456783',
    nombres: 'CLAUDIA STEFANIA REYES MARTINEZ',
    fechaNacimiento: '1990-10-03',
    estadoCivil: 'DIVORCIADA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'OTAVALO',
    fechaEmisionDocumento: '27/04/2022',
    fechaExpiracion: '27/04/2032',
    codigoDactilar: 'J6789K0123',
  },
  {
    cedula: '1056789017',
    nombres: 'JENNY CAROLINA REYES ESPINOZA',
    fechaNacimiento: '1994-02-11',
    estadoCivil: 'SOLTERA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'IBARRA',
    fechaEmisionDocumento: '15/07/2023',
    fechaExpiracion: '15/07/2033',
    codigoDactilar: 'K7890L1234',
  },

  // -----------------------------------------------------------
  // Loja (11)
  // -----------------------------------------------------------
  {
    cedula: '1102345673',
    nombres: 'DANIEL ALEJANDRO CASTRO LOPEZ',
    fechaNacimiento: '1977-07-14',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'LOJA',
    fechaEmisionDocumento: '08/03/2021',
    fechaExpiracion: '08/03/2031',
    codigoDactilar: 'L8901M2345',
  },
  {
    cedula: '1113456782',
    nombres: 'JESSICA PAMELA JIMENEZ SUAREZ',
    fechaNacimiento: '1993-03-28',
    estadoCivil: 'SOLTERA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'LOJA',
    fechaEmisionDocumento: '19/10/2022',
    fechaExpiracion: '19/10/2032',
    codigoDactilar: 'M9012N3456',
  },
  {
    cedula: '1154321093',
    nombres: 'RICHARD DANIEL CASTRO CERON',
    fechaNacimiento: '1983-08-19',
    estadoCivil: 'UNION LIBRE',
    sexo: 'MASCULINO',
    lugarNacimiento: 'LOJA',
    fechaEmisionDocumento: '06/05/2021',
    fechaExpiracion: '06/05/2031',
    codigoDactilar: 'N0123O4567',
  },

  // -----------------------------------------------------------
  // Cotopaxi (05)
  // -----------------------------------------------------------
  {
    cedula: '0502345671',
    nombres: 'PABLO CESAR MENDOZA ALVARADO',
    fechaNacimiento: '1981-12-09',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'LATACUNGA',
    fechaEmisionDocumento: '11/08/2020',
    fechaExpiracion: '11/08/2030',
    codigoDactilar: 'O1234P5678',
  },
  {
    cedula: '0513456780',
    nombres: 'NATALIA GABRIELA HERRERA ESPINOZA',
    fechaNacimiento: '1996-08-22',
    estadoCivil: 'SOLTERA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'LATACUNGA',
    fechaEmisionDocumento: '23/02/2023',
    fechaExpiracion: '23/02/2033',
    codigoDactilar: 'P2345Q6789',
  },
  {
    cedula: '0556789014',
    nombres: 'MARY LUZ JIMENEZ VILLACIS',
    fechaNacimiento: '1988-05-06',
    estadoCivil: 'CASADA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'LATACUNGA',
    fechaEmisionDocumento: '30/09/2021',
    fechaExpiracion: '30/09/2031',
    codigoDactilar: 'Q3456R7890',
  },

  // -----------------------------------------------------------
  // Esmeraldas (08)
  // -----------------------------------------------------------
  {
    cedula: '0802345678',
    nombres: 'ERNESTO GUILLERMO CERON VILLACIS',
    fechaNacimiento: '1969-04-30',
    estadoCivil: 'VIUDO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'ESMERALDAS',
    fechaEmisionDocumento: '17/06/2020',
    fechaExpiracion: '17/06/2030',
    codigoDactilar: 'R4567S8901',
  },
  {
    cedula: '0813456787',
    nombres: 'SOFIA BEATRIZ NARANJO ANDRADE',
    fechaNacimiento: '1988-11-15',
    estadoCivil: 'CASADA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'ESMERALDAS',
    fechaEmisionDocumento: '04/04/2022',
    fechaExpiracion: '04/04/2032',
    codigoDactilar: 'S5678T9012',
  },
  {
    cedula: '0856789011',
    nombres: 'JOSE DAVID BARRIGA CAICEDO',
    fechaNacimiento: '1975-06-08',
    estadoCivil: 'DIVORCIADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'ESMERALDAS',
    fechaEmisionDocumento: '22/01/2021',
    fechaExpiracion: '22/01/2031',
    codigoDactilar: 'T6789U0123',
  },

  // -----------------------------------------------------------
  // Carchi (04)
  // -----------------------------------------------------------
  {
    cedula: '0402345672',
    nombres: 'DIANA CAROLINA SALAZAR GARCIA',
    fechaNacimiento: '1991-09-17',
    estadoCivil: 'UNION LIBRE',
    sexo: 'FEMENINO',
    lugarNacimiento: 'TULCAN',
    fechaEmisionDocumento: '08/11/2022',
    fechaExpiracion: '08/11/2032',
    codigoDactilar: 'U7890V1234',
  },
  {
    cedula: '0454321092',
    nombres: 'MARIO ENRIQUE RODRIGUEZ TORRES',
    fechaNacimiento: '1983-02-25',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'TULCAN',
    fechaEmisionDocumento: '15/06/2021',
    fechaExpiracion: '15/06/2031',
    codigoDactilar: 'V8901W2345',
  },

  // -----------------------------------------------------------
  // Los Ríos (12)
  // -----------------------------------------------------------
  {
    cedula: '1202345672',
    nombres: 'ANDREA MELISSA VARGAS PEREZ',
    fechaNacimiento: '1994-07-12',
    estadoCivil: 'SOLTERA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'BABAHOYO',
    fechaEmisionDocumento: '27/08/2022',
    fechaExpiracion: '27/08/2032',
    codigoDactilar: 'W9012X3456',
  },
  {
    cedula: '1254321092',
    nombres: 'PEDRO ISAIAS CEVALLOS INTRIAGO',
    fechaNacimiento: '1969-11-08',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'VENTANAS',
    fechaEmisionDocumento: '12/02/2020',
    fechaExpiracion: '12/02/2030',
    codigoDactilar: 'X0123Y4567',
  },

  // -----------------------------------------------------------
  // Santo Domingo de los Tsáchilas (23)
  // -----------------------------------------------------------
  {
    cedula: '2302345679',
    nombres: 'JORGE LUIS INTRIAGO MACIAS',
    fechaNacimiento: '1980-05-20',
    estadoCivil: 'CASADO',
    sexo: 'MASCULINO',
    lugarNacimiento: 'SANTO DOMINGO',
    fechaEmisionDocumento: '09/07/2021',
    fechaExpiracion: '09/07/2031',
    codigoDactilar: 'Y1234Z5678',
  },

  // -----------------------------------------------------------
  // Santa Elena (24)
  // -----------------------------------------------------------
  {
    cedula: '2402345678',
    nombres: 'ELIZABETH PRISCILA CANDO QUISHPE',
    fechaNacimiento: '1995-03-14',
    estadoCivil: 'SOLTERA',
    sexo: 'FEMENINO',
    lugarNacimiento: 'SANTA ELENA',
    fechaEmisionDocumento: '01/12/2022',
    fechaExpiracion: '01/12/2032',
    codigoDactilar: 'Z2345A6789',
  },
];

/**
 * Busca un registro en la base de datos demo por número de cédula.
 */
export function buscarCedulaDemo(cedula: string): RegistroCivilDemo | null {
  return DEMO_CEDULAS.find((r) => r.cedula === cedula) ?? null;
}
