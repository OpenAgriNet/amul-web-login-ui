/**
 * Amul API TypeScript SDK
 *
 * A complete TypeScript SDK for interacting with Amul Farmer APIs.
 * Extracted from APK decompilation and verified via MITM traffic capture.
 *
 * @example
 * ```typescript
 * import { AmulApiClient } from 'amul-sdk';
 *
 * const client = new AmulApiClient({ debug: true });
 *
 * // Send OTP
 * await client.sendOtp('9876543210');
 *
 * // Verify OTP
 * await client.verifyOtp('9876543210', '123456');
 *
 * // Get farmer data
 * const farmer = await client.getFarmerDetail();
 * console.log(farmer.Data?.FarmerName);
 * ```
 */

// Main client
export { AmulApiClient, default } from './client';

// Types
export * from './types';

// Constants
export * from './constants';
