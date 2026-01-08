
export const CANDIDATE_NAME = "Coalición Agenda Ciudadana";

export const COLORS = {
  yellow: '#f5bf29',
  green: '#008e88',
  red: '#c92a2b',
  greenDark: '#007a75',
  redDark: '#a82324'
};

export const MERCH_ITEMS = [
  { id: 1, name: "Bandera", type: "Bandera", stock: "Disponible", image: "https://res.cloudinary.com/dkw8sr9rj/image/upload/v1765828178/bandera_tv8phv.jpg" },
  { id: 3, name: "Camiseta Oficial", type: "Ropa", stock: "Disponible", image: "https://res.cloudinary.com/dkw8sr9rj/image/upload/v1765828513/Camisa_gnciht.jpg" },
  { id: 5, name: "Lonas", type: "Lona", stock: "Disponible", image: "https://res.cloudinary.com/dkw8sr9rj/image/upload/v1767820769/Lona_osxcgj.jpg" },
  { id: 6, name: "Bandana", type: "Mascotas", stock: "Disponible", image: "https://res.cloudinary.com/dkw8sr9rj/image/upload/v1767821013/Bandana_Perrito_ybspc9.png" },
  { id: 7, name: "Gorras", type: "Ropa", stock: "Disponible", image: "https://res.cloudinary.com/dkw8sr9rj/image/upload/v1767821290/GorraBlanca-IconoCoalicion_id1np5.jpg" },
  { id: 8, name: "Totebag", type: "Accesorio", stock: "Disponible", image: "https://res.cloudinary.com/dkw8sr9rj/image/upload/v1767821268/ToteBag-Coalicion_hau3u4.jpg" },
  { id: 4, name: "Calcomanías", type: "Accesorio", stock: "Disponible", image: "https://res.cloudinary.com/dkw8sr9rj/image/upload/v1765829683/Calcomani%CC%81as_nfdafo.jpg" },
  { id: 2, name: "Volantes", type: "Papelería", stock: "Disponible", image: "https://res.cloudinary.com/dkw8sr9rj/image/upload/v1765829140/volante_jqyqkv.jpg" },
];

interface ProvinceCenter {
  province: string;
  centers: string[];
}

export const PROVINCE_CENTERS: Record<string, ProvinceCenter> = {
  '1': { province: 'San José', centers: ['Liceo de Costa Rica', 'Escuela Buenaventura Corrales', 'Liceo de Escazú', 'Escuela Joaquín García Monge'] },
  '2': { province: 'Alajuela', centers: ['Instituto de Alajuela', 'Escuela Ascensión Esquivel', 'Liceo de San Carlos', 'Escuela Pacto del Jocote'] },
  '3': { province: 'Cartago', centers: ['Colegio San Luis Gonzaga', 'Escuela Jesús Jiménez', 'Liceo de Paraíso', 'Escuela del Guarco'] },
  '4': { province: 'Heredia', centers: ['Liceo de Heredia', 'Escuela Cleto González Víquez', 'Colegio de San Joaquín', 'Escuela Santo Domingo'] },
  '5': { province: 'Guanacaste', centers: ['Liceo de Nicoya', 'Escuela Ascensión Esquivel', 'CTP de Liberia', 'Escuela de Santa Cruz'] },
  '6': { province: 'Puntarenas', centers: ['Liceo José Martí', 'Escuela Antonio Obando', 'Colegio Técnico de Jacó', 'Liceo de Coto Brus'] },
  '7': { province: 'Limón', centers: ['Escuela Balvanero Vargas', 'Liceo de Limón', 'Escuela de Guápiles', 'Colegio Técnico de Talamanca'] },
  '8': { province: 'Naturalizado/a', centers: ['Tribunal Supremo de Elecciones', 'Liceo de Costa Rica'] }, 
  '9': { province: 'Naturalizado/a', centers: ['Tribunal Supremo de Elecciones', 'Liceo de Costa Rica'] }  
};
