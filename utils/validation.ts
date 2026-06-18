/**
 * Utility functions for programmatic content validation.
 * No AI is used; these are strict regex and algorithmic filters.
 */

// Regex patterns
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

// URL and Link regex: matches protocols, www, or typical domains with extensions to prevent false positives on decimals
const LINK_REGEX = /(https?:\/\/|www\.)[^\s]+|\b[a-zA-Z0-9.-]+\.(?:com|cl|net|org|co|info|biz|app|dev|io|online|site|store|tech|xyz)\b(?:\/[^\s]*)?/gi;

// Phone number regex: matches sequences of 8-12 numbers, possibly with country code (+56, etc.) and spaces or hyphens
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}|\b\d{8,12}\b/g;

// RUT regex: matches Chilean RUT format (e.g., 12.345.678-9, 12345678-9, 123456789)
const RUT_PATTERN_REGEX = /\b\d{1,2}(?:\.?\d{3}){2}-?[0-9kK]\b/g;

/**
 * Validates Chilean RUT check digit (Modulo 11)
 */
export function isValidRut(rutStr: string): boolean {
  // Clean characters except numbers and K/k
  const cleanRut = rutStr.replace(/[^0-9kK]/g, '');
  if (cleanRut.length < 8) return false;

  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toLowerCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDvVal = 11 - (sum % 11);
  let expectedDv = '';
  if (expectedDvVal === 11) expectedDv = '0';
  else if (expectedDvVal === 10) expectedDv = 'k';
  else expectedDv = expectedDvVal.toString();

  return dv === expectedDv;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Programmatic check to ensure text does not contain sensitive details
 * (links, emails, phone numbers, or RUTs)
 */
export function validateContent(text: string, fieldName = 'El contenido'): ValidationResult {
  if (!text || text.trim() === '') {
    return { isValid: false, error: `${fieldName} no puede estar vacío.` };
  }

  // Check for emails
  if (EMAIL_REGEX.test(text)) {
    return {
      isValid: false,
      error: `${fieldName} contiene un correo electrónico. No se permite compartir datos de contacto.`
    };
  }

  // Check for links
  if (LINK_REGEX.test(text)) {
    return {
      isValid: false,
      error: `${fieldName} contiene enlaces o nombres de dominio. Por seguridad, no se permiten URLs.`
    };
  }

  // Check for phone numbers
  const phoneMatches = text.match(PHONE_REGEX);
  if (phoneMatches) {
    // Check if it's just normal short numbers like years (e.g. 2026) or counts by filtering them out
    const potentialPhones = phoneMatches.filter(match => {
      const digitsOnly = match.replace(/\D/g, '');
      // If it's a 4-digit number (e.g. year), or just a small number, ignore
      return digitsOnly.length >= 8 && digitsOnly.length <= 15;
    });

    if (potentialPhones.length > 0) {
      return {
        isValid: false,
        error: `${fieldName} contiene un número telefónico. No se permite compartir números telefónicos.`
      };
    }
  }

  // Check for RUT
  const rutMatches = text.match(RUT_PATTERN_REGEX);
  if (rutMatches) {
    // Validate each match with modulo 11
    for (const match of rutMatches) {
      if (isValidRut(match)) {
        return {
          isValid: false,
          error: `${fieldName} contiene un RUT chileno válido. No se permite compartir números de identificación personal.`
        };
      }
    }
  }

  return { isValid: true };
}
