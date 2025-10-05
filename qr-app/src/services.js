// src/services.js
import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  orderBy,
  query,
  where,
  limit,
} from "firebase/firestore";
/**
 * Guarda inspección en la colección "inspections"
 */
export async function addInspection({
  legajo,
  interno,
  categoria,
  accion = "",
  observaciones = "",
  metodo = "qr",
}) {
  const inspections = collection(db, "inspections");
  await addDoc(inspections, {
    legajo,
    interno,
    categoria,
    accion,
    observaciones,
    metodo,
    createdAt: serverTimestamp(),
  });
}

/**
 * Lee inspecciones (opcional) — trae las últimas y las filtra en cliente
 */
export async function fetchInspections({
  legajoFilter,
  internoFilter,
  categoriaFilter,
} = {}) {
  const inspections = collection(db, "inspections");
  const q = query(inspections, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return data.filter((r) => {
    if (legajoFilter && r.legajo !== legajoFilter) return false;
    if (internoFilter && r.interno !== internoFilter) return false;
    if (categoriaFilter && r.categoria !== categoriaFilter) return false;
    return true;
  });
}

/**
 * Devuelve un Map con la última inspección por interno para una categoría.
 * keys: interno (string/number) -> value: doc {id, ...data}
 * Para eficiencia: traemos las inspecciones más recientes y calculamos en cliente.
 */
export async function fetchLastByInternoForCategory(category, maxFetch = 3000) {
  const inspectionsRef = collection(db, "inspections");
  // Traemos recientes por fecha desc (límite alto razonable)
  const q = query(
    inspectionsRef,
    orderBy("createdAt", "desc"),
    limit(maxFetch)
  );
  const snap = await getDocs(q);
  const map = new Map();
  snap.forEach((d) => {
    const val = d.data();
    if (val.categoria !== category) return;
    const internoKey = String(val.interno);
    // si aún no registramos este interno, este es el más reciente
    if (!map.has(internoKey)) map.set(internoKey, { id: d.id, ...val });
  });
  return map;
}

/** Historial por legajo (simple: where y luego ordena cliente-side) */
export async function fetchByLegajo(legajo) {
  if (!legajo) return [];
  const inspectionsRef = collection(db, "inspections");
  // Solo where por legajo para evitar índices; luego ordenamos por createdAt
  const q = query(inspectionsRef, where("legajo", "==", String(legajo)));
  const snap = await getDocs(q);
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  // Orden por fecha desc (si existe)
  rows.sort((a, b) => {
    const ta = a.createdAt?.toDate?.() ?? 0;
    const tb = b.createdAt?.toDate?.() ?? 0;
    return tb - ta;
  });
  return rows;
}

export async function fetchByInterno(interno) {
  if (!interno) return [];
  const inspectionsRef = collection(db, "inspections");
  const q = query(inspectionsRef, where("interno", "==", String(interno)));
  const snap = await getDocs(q);
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  // ordenar por fecha descendente
  rows.sort((a, b) => {
    const ta = a.createdAt?.toDate?.() ?? 0;
    const tb = b.createdAt?.toDate?.() ?? 0;
    return tb - ta;
  });
  return rows;
}
