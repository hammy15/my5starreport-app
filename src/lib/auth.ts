/**
 * Authentication utilities for my5starreport.com
 * Simple email/password auth with session tokens
 */

import { sql } from './db';
import crypto from 'crypto';

// Hash password using SHA-256 (in production, use bcrypt)
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate session token
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate share token
export function generateShareToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

// User type
export interface User {
  id: number;
  email: string;
  name: string | null;
  company: string | null;
  role: string | null;
  created_at: string;
  last_login: string | null;
}

// Create new user
export async function createUser(email: string, password: string, name?: string, company?: string): Promise<User | null> {
  try {
    const passwordHash = hashPassword(password);
    const result = await sql`
      INSERT INTO users (email, password_hash, name, company)
      VALUES (${email.toLowerCase()}, ${passwordHash}, ${name || null}, ${company || null})
      RETURNING id, email, name, company, role, created_at, last_login
    `;
    return result[0] as User;
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
      return null;
    }
    throw error;
  }
}

// Verify user credentials
export async function verifyUser(email: string, password: string): Promise<User | null> {
  const passwordHash = hashPassword(password);
  const result = await sql`
    SELECT id, email, name, company, role, created_at, last_login
    FROM users
    WHERE email = ${email.toLowerCase()} AND password_hash = ${passwordHash}
  `;

  if (result[0]) {
    // Update last login
    await sql`UPDATE users SET last_login = NOW() WHERE id = ${result[0].id}`;
    return result[0] as User;
  }
  return null;
}

// Get user by ID
export async function getUserById(userId: number): Promise<User | null> {
  const result = await sql`
    SELECT id, email, name, company, role, created_at, last_login
    FROM users WHERE id = ${userId}
  `;
  return result[0] as User || null;
}

// Update user profile
export async function updateUser(userId: number, data: { name?: string; company?: string; role?: string }): Promise<User | null> {
  const result = await sql`
    UPDATE users
    SET name = COALESCE(${data.name || null}, name),
        company = COALESCE(${data.company || null}, company),
        role = COALESCE(${data.role || null}, role)
    WHERE id = ${userId}
    RETURNING id, email, name, company, role, created_at, last_login
  `;
  return result[0] as User || null;
}

// Saved Scenario type
export interface SavedScenario {
  id: number;
  user_id: number;
  facility_ccn: string;
  facility_name: string;
  scenario_name: string;
  scenario_data: any;
  predicted_ratings: any;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Save a scenario
export async function saveScenario(
  userId: number,
  facilityCcn: string,
  facilityName: string,
  scenarioName: string,
  scenarioData: any,
  predictedRatings: any,
  notes?: string
): Promise<SavedScenario> {
  const result = await sql`
    INSERT INTO saved_scenarios (user_id, facility_ccn, facility_name, scenario_name, scenario_data, predicted_ratings, notes)
    VALUES (${userId}, ${facilityCcn}, ${facilityName}, ${scenarioName}, ${JSON.stringify(scenarioData)}, ${JSON.stringify(predictedRatings)}, ${notes || null})
    RETURNING *
  `;
  return result[0] as SavedScenario;
}

// Get user's saved scenarios
export async function getUserScenarios(userId: number): Promise<SavedScenario[]> {
  const result = await sql`
    SELECT * FROM saved_scenarios
    WHERE user_id = ${userId}
    ORDER BY updated_at DESC
  `;
  return result as SavedScenario[];
}

// Delete scenario
export async function deleteScenario(userId: number, scenarioId: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM saved_scenarios
    WHERE id = ${scenarioId} AND user_id = ${userId}
  `;
  return true;
}

// Update scenario
export async function updateScenario(
  userId: number,
  scenarioId: number,
  updates: { scenario_name?: string; scenario_data?: any; predicted_ratings?: any; notes?: string }
): Promise<SavedScenario | null> {
  const result = await sql`
    UPDATE saved_scenarios
    SET scenario_name = COALESCE(${updates.scenario_name || null}, scenario_name),
        scenario_data = COALESCE(${updates.scenario_data ? JSON.stringify(updates.scenario_data) : null}, scenario_data),
        predicted_ratings = COALESCE(${updates.predicted_ratings ? JSON.stringify(updates.predicted_ratings) : null}, predicted_ratings),
        notes = COALESCE(${updates.notes || null}, notes),
        updated_at = NOW()
    WHERE id = ${scenarioId} AND user_id = ${userId}
    RETURNING *
  `;
  return result[0] as SavedScenario || null;
}

// Favorite facility type
export interface FavoriteFacility {
  id: number;
  user_id: number;
  facility_ccn: string;
  facility_name: string;
  added_at: string;
}

// Add favorite
export async function addFavorite(userId: number, facilityCcn: string, facilityName: string): Promise<FavoriteFacility | null> {
  try {
    const result = await sql`
      INSERT INTO favorite_facilities (user_id, facility_ccn, facility_name)
      VALUES (${userId}, ${facilityCcn}, ${facilityName})
      ON CONFLICT (user_id, facility_ccn) DO NOTHING
      RETURNING *
    `;
    return result[0] as FavoriteFacility || null;
  } catch {
    return null;
  }
}

// Remove favorite
export async function removeFavorite(userId: number, facilityCcn: string): Promise<boolean> {
  await sql`DELETE FROM favorite_facilities WHERE user_id = ${userId} AND facility_ccn = ${facilityCcn}`;
  return true;
}

// Get user favorites
export async function getUserFavorites(userId: number): Promise<FavoriteFacility[]> {
  const result = await sql`
    SELECT * FROM favorite_facilities
    WHERE user_id = ${userId}
    ORDER BY added_at DESC
  `;
  return result as FavoriteFacility[];
}

// Shared report type
export interface SharedReport {
  id: number;
  user_id: number;
  share_token: string;
  report_type: string;
  report_data: any;
  expires_at: string | null;
  created_at: string;
}

// Create shared report
export async function createSharedReport(
  userId: number,
  reportType: string,
  reportData: any,
  expiresInHours: number = 168 // 7 days default
): Promise<SharedReport> {
  const token = generateShareToken();
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();

  const result = await sql`
    INSERT INTO shared_reports (user_id, share_token, report_type, report_data, expires_at)
    VALUES (${userId}, ${token}, ${reportType}, ${JSON.stringify(reportData)}, ${expiresAt})
    RETURNING *
  `;
  return result[0] as SharedReport;
}

// Get shared report by token
export async function getSharedReport(token: string): Promise<SharedReport | null> {
  const result = await sql`
    SELECT * FROM shared_reports
    WHERE share_token = ${token} AND (expires_at IS NULL OR expires_at > NOW())
  `;
  return result[0] as SharedReport || null;
}
