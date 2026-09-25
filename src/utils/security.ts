// Utilidades de sanitización y defensa contra XSS / inyecciones

/**
 * Sanitiza una cadena de texto eliminando etiquetas HTML, scripts y caracteres de control peligrosos.
 * Previene Cross-Site Scripting (XSS) y truncado por buffer overflow.
 */
export function sanitizeText(input: unknown, maxLength = 200): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    // Elimina tags HTML (<script>, <img>, <iframe>, etc.)
    .replace(/<[^>]*>?/gm, '')
    // Reemplaza entidades o caracteres peligrosos para renderizado
    .replace(/[&<>"'/]/g, (match) => {
      const escapeMap: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
      };
      return escapeMap[match] || match;
    })
    // Limita la longitud máxima para prevenir ataques DoS de memoria
    .slice(0, maxLength);
}

/**
 * Valida y sanitiza montos monetarios.
 * Evita números negativos no autorizados, NaN, Infinity o números gigantes que rompan la base de datos.
 */
export function sanitizeAmount(value: unknown, min = 0.01, max = 100_000_000_000): number {
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  
  if (isNaN(num) || !isFinite(num)) {
    return 0;
  }
  
  // Limitar entre min y max y redondear a 2 decimales
  const clamped = Math.min(Math.max(num, min), max);
  return Math.round(clamped * 100) / 100;
}

/**
 * Valida formato estándar de email seguro.
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Evalúa la robustez de una contraseña.
 * Retorna nivel de seguridad y recomendaciones.
 */
export function evaluatePasswordStrength(password: string): {
  score: number; // 0 a 4
  label: 'Muy débil' | 'Débil' | 'Aceptable' | 'Fuerte' | 'Muy Fuerte';
  feedback: string;
} {
  if (!password) {
    return { score: 0, label: 'Muy débil', feedback: 'Ingresa una contraseña' };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const normalizedScore = Math.min(score, 4);
  const labels: Array<'Muy débil' | 'Débil' | 'Aceptable' | 'Fuerte' | 'Muy Fuerte'> = [
    'Muy débil',
    'Débil',
    'Aceptable',
    'Fuerte',
    'Muy Fuerte'
  ];

  let feedback = 'Buena contraseña';
  if (password.length < 6) feedback = 'Mínimo 6 caracteres requeridos por Firebase';
  else if (password.length < 8) feedback = 'Recomendado al menos 8 caracteres';
  else if (!/[0-9]/.test(password)) feedback = 'Agrega al menos un número';
  else if (!/[A-Z]/.test(password)) feedback = 'Agrega una letra mayúscula';

  return {
    score: normalizedScore,
    label: labels[normalizedScore],
    feedback
  };
}

/**
 * Rate Limiter en memoria para el cliente (prevención de spam o ataques de fuerza bruta rápidos).
 */
class ClientRateLimiter {
  private attempts: Record<string, { count: number; lockedUntil: number }> = {};

  public checkLimit(actionKey: string, maxAttempts = 5, lockDurationSeconds = 30): { allowed: boolean; waitSeconds: number } {
    const now = Date.now();
    const entry = this.attempts[actionKey] || { count: 0, lockedUntil: 0 };

    if (now < entry.lockedUntil) {
      const waitSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
      return { allowed: false, waitSeconds };
    }

    // Si ya pasó el bloqueo, resetear
    if (now >= entry.lockedUntil && entry.lockedUntil > 0) {
      entry.count = 0;
      entry.lockedUntil = 0;
    }

    return { allowed: true, waitSeconds: 0 };
  }

  public recordFailure(actionKey: string, maxAttempts = 5, lockDurationSeconds = 30): void {
    const now = Date.now();
    const entry = this.attempts[actionKey] || { count: 0, lockedUntil: 0 };
    entry.count += 1;

    if (entry.count >= maxAttempts) {
      entry.lockedUntil = now + (lockDurationSeconds * 1000);
    }

    this.attempts[actionKey] = entry;
  }

  public reset(actionKey: string): void {
    delete this.attempts[actionKey];
  }
}

export const authRateLimiter = new ClientRateLimiter();
