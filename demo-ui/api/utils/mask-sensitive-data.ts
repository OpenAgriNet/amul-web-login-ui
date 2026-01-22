/**
 * Utility function to mask sensitive financial information in farmer data
 * Based on OpenAPI spec for GetFarmerDetail API
 * 
 * Sensitive fields that should be masked:
 * - BankAccountNo: Bank account number
 * - IFSCCode: IFSC code
 * - BankBranchCode: Bank branch code
 * 
 * Fields that should remain unmasked:
 * - BankName: Bank name (not sensitive)
 */

/**
 * Masks a string value, showing only first 2 and last 2 characters
 * @param value - The value to mask
 * @param minLength - Minimum length to apply masking (default: 4)
 * @returns Masked string or original value if too short
 */
function maskString(value: string | null | undefined, minLength: number = 4): string | null {
  if (!value || typeof value !== 'string') {
    return value;
  }

  if (value.length < minLength) {
    // For very short values, mask all but first character
    return value.length > 1 ? value[0] + '*'.repeat(value.length - 1) : '*';
  }

  // Show first 2 and last 2 characters, mask the rest
  const firstTwo = value.substring(0, 2);
  const lastTwo = value.substring(value.length - 2);
  const maskedMiddle = '*'.repeat(Math.max(0, value.length - 4));
  
  return firstTwo + maskedMiddle + lastTwo;
}

/**
 * Masks sensitive financial fields in Amul farmer data
 * @param amulFarmer - The Amul farmer data object
 * @returns A new object with sensitive fields masked
 */
export function maskSensitiveFinancialData(amulFarmer: any): any {
  if (!amulFarmer || typeof amulFarmer !== 'object') {
    return amulFarmer;
  }

  // Create a shallow copy to avoid mutating the original
  const masked = { ...amulFarmer };

  // Mask BankAccountNo (bank account number)
  if ('BankAccountNo' in masked) {
    masked.BankAccountNo = maskString(masked.BankAccountNo);
  }

  // Mask IFSCCode (IFSC code)
  if ('IFSCCode' in masked) {
    masked.IFSCCode = maskString(masked.IFSCCode);
  }

  // Mask BankBranchCode (bank branch code)
  if ('BankBranchCode' in masked) {
    masked.BankBranchCode = maskString(masked.BankBranchCode);
  }

  // BankName is intentionally NOT masked (as per requirements)

  return masked;
}
