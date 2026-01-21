/**
 * Amul API TypeScript SDK
 *
 * A complete TypeScript SDK for interacting with Amul Farmer APIs.
 * Extracted from APK decompilation and verified via MITM traffic capture.
 *
 * @example PashuGPT APIs (NO OTP Required - for Chatbot)
 * ```typescript
 * import { AmulApiClient } from 'amul-sdk';
 *
 * const client = new AmulApiClient({ debug: true });
 *
 * // Get farmer by mobile (no auth needed!)
 * const farmers = await client.getPashuGPTFarmerByMobile('9601335568');
 * console.log(`${farmers[0].farmerName} has ${farmers[0].totalAnimals} animals`);
 *
 * // Get animal details with breeding info
 * const animal = await client.getPashuGPTAnimalByTag('106290093933');
 * console.log(`${animal.breed} ${animal.animalType}`);
 * console.log(`Milking: ${animal.milkingStage}, Pregnant: ${animal.pregnancyStage}`);
 * console.log(`Lactation #${animal.lactationNo}`);
 * console.log(`Last AI: ${animal.lastBreedingActivity.lastAI}`);
 *
 * // Helper methods
 * if (AmulApiClient.isLikelyInHeat(animal)) {
 *   console.log('Animal may be in heat - recommend AI');
 * }
 * if (AmulApiClient.shouldRecommendPD(animal)) {
 *   console.log('Recommend pregnancy detection');
 * }
 * ```
 *
 * @example Amul App APIs (OTP Required)
 * ```typescript
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
