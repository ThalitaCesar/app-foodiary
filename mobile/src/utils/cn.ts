import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
//twMerge é usado para combinar classes do tailwind, removendo duplicatas e resolvendo conflitos
// clsx é usado para condicionalmente combinar classes com base em condições lógicas
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
