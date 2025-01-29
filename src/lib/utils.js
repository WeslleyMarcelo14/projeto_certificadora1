import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Função utilitária para combinar classes do Tailwind e resolver conflitos.
 *
 * @param {...any} inputs - Classes do Tailwind ou outras strings de classe.
 * @returns {string} - String final de classes mescladas e otimizadas.
 */
export const cn = (...inputs) => twMerge(clsx(inputs));
