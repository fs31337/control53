// src/services.js
import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  orderBy,
  query,
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
