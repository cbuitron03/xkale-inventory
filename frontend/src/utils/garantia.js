// garantia_vigente lo calcula el backend comparando garantia_hasta con la fecha actual
export const estadoGarantia = (l) =>
  l.garantia_vigente == null ? 'sin_garantia' : l.garantia_vigente ? 'vigente' : 'expirada';
