import type { ViaCepResponse } from "@/lib/viacep";
import {
  FRETE_DEMAIS,
  FRETE_FALLBACK,
  FRETE_MESMO_4DIG,
  FRETE_MESMO_5DIG,
  STORE_CEP_DIGITS,
} from "@/lib/storeConfig";

export function freightFromCepData(
  cepData: ViaCepResponse | null,
  customerCepDigits: string,
): { fee: number; label: string } {
  const cust = customerCepDigits.replace(/\D/g, "");
  if (cust.length !== 8 || !cepData?.localidade)
    return { fee: FRETE_FALLBACK, label: "CEP incompleto — taxa estimada" };

  const store = STORE_CEP_DIGITS;
  if (!store || store.length < 8)
    return { fee: FRETE_FALLBACK, label: `${cepData.localidade}/${cepData.uf}` };

  if (cust.slice(0, 5) === store.slice(0, 5))
    return { fee: FRETE_MESMO_5DIG, label: `${cepData.localidade}/${cepData.uf} — região próxima` };
  if (cust.slice(0, 4) === store.slice(0, 4))
    return { fee: FRETE_MESMO_4DIG, label: `${cepData.localidade}/${cepData.uf}` };
  return { fee: FRETE_DEMAIS, label: `${cepData.localidade}/${cepData.uf} — rota maior` };
}
