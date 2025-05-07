import { pgTable, text, serial, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// City table schema
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  countryCode: text("country_code").notNull(),
  population: numeric("population").notNull(),
  timezone: text("timezone").notNull(),
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
  lastWeatherUpdate: timestamp("last_weather_update"),
  currentTemp: numeric("current_temp"),
  currentCondition: text("current_condition"),
  highTemp: numeric("high_temp"),
  lowTemp: numeric("low_temp"),
});

// User table schema (keeping the existing users table)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Weather cache table to store weather data
export const weatherCache = pgTable("weather_cache", {
  id: serial("id").primaryKey(),
  cityName: text("city_name").notNull(),
  data: text("data").notNull(), // JSON string of weather data
  timestamp: timestamp("timestamp").notNull(),
});

// Schemas for inserting data
export const insertCitySchema = createInsertSchema(cities).omit({
  id: true,
  lastWeatherUpdate: true,
  currentTemp: true,
  currentCondition: true,
  highTemp: true,
  lowTemp: true,
});

export const insertWeatherCacheSchema = createInsertSchema(weatherCache).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// TypeScript types for database operations
export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof cities.$inferSelect;

export type InsertWeatherCache = z.infer<typeof insertWeatherCacheSchema>;
export type WeatherCache = typeof weatherCache.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
