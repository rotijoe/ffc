# Distance Feature Implementation Guide

This guide explains how to set up the server-side distance calculation feature for your fried chicken shop finder app.

## Overview

The implementation includes:

- ✅ PostGIS extension for geographic calculations
- ✅ Server-side distance calculation and sorting
- ✅ Client-side geolocation hook
- ✅ Distance display in shop cards
- ✅ Toggle between alphabetical and distance-based sorting
- ✅ Graceful fallbacks when location is unavailable

## Setup Instructions

### 1. Enable PostGIS in Supabase

#### Option A: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Database** → **Extensions**
3. Search for "postgis" and enable it
4. Go to **SQL Editor**
5. Copy and paste the contents of `supabase/sql/enable_postgis_and_distance_function.sql`
6. Click **Run** to execute the SQL

#### Option B: Via SQL Migration

1. Create a new migration file:
   ```bash
   npx supabase migration new enable_postgis_distance
   ```
2. Copy the contents of `supabase/sql/enable_postgis_and_distance_function.sql` into the migration file
3. Apply the migration:
   ```bash
   npx supabase db push
   ```

### 2. Verify Your Database Schema

Ensure your `fried_chicken_shops` table has the following columns:

- `latitude` (numeric) - Required for distance calculations
- `longitude` (numeric) - Required for distance calculations
- `fhrs_id` (bigint, primary key)
- `business_name` (text)
- `address` (text)

### 3. Test the Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `/shops` in your browser

3. The app will:
   - Request your location permission
   - Display a location control bar
   - Allow you to toggle between "Sort by Name" and "Sort by Distance"
   - Show distance information on shop cards when sorting by distance

## Features

### Geolocation Hook (`src/hooks/use-geolocation.ts`)

- Automatically requests user location on mount
- Handles permission errors gracefully
- Provides loading states and error messages
- Configurable timeout and accuracy options

### Distance Calculation

- Uses PostGIS `ST_Distance` function for accurate geographic calculations
- Calculates distances in miles (easily configurable to kilometers)
- Server-side sorting ensures true distance-based results across all pages
- Graceful fallback to alphabetical sorting when PostGIS is unavailable

### User Interface

- **Location Control Bar**: Shows current location status and sort toggle
- **Distance Display**: Shows distance on shop cards with map pin icon
- **Sort Toggle**: Switch between alphabetical and distance-based sorting
- **Responsive Design**: Works on mobile and desktop

## API Functions

### Server-Side (`src/lib/shops-api.ts`)

- `getShopsNearLocation(userLocation, page)` - Fetches shops sorted by distance
- `formatDistance(distance)` - Formats distance for display

### Client-Side (`src/app/shops/components/shop-list/helpers.ts`)

- `fetchShopsNearLocation(userLocation, page)` - Client-side distance query
- Fallback to regular `fetchShops()` if PostGIS is unavailable

## Database Function

The `get_shops_with_distance` function:

- Takes user latitude/longitude as parameters
- Calculates distance using PostGIS geography functions
- Returns paginated results sorted by distance
- Includes total count for pagination
- Filters out shops with invalid coordinates (null, 0, 0)

## Error Handling

The implementation includes comprehensive error handling:

- **Location Permission Denied**: Shows appropriate error message
- **Location Timeout**: Configurable timeout with fallback
- **PostGIS Unavailable**: Graceful fallback to alphabetical sorting
- **Network Errors**: Retry functionality in UI

## Performance Considerations

### Current Implementation

- Uses `ST_Distance` with lat/lng columns
- Suitable for moderate datasets (thousands of records)

### For Better Performance (Optional)

Uncomment the geography column code in the SQL file to:

- Add a proper `geography(POINT, 4326)` column
- Create a spatial index (GIST) for faster queries
- Use more efficient PostGIS functions

## Future Enhancements

This implementation sets the foundation for:

- **Map Integration**: Coordinates are now available for map display
- **Radius Filtering**: "Show shops within X miles"
- **Advanced Sorting**: Multiple sort criteria (distance + rating)
- **Clustering**: Group nearby shops on maps
- **Caching**: Cache calculated distances for performance

## Troubleshooting

### Location Not Working

- Check browser permissions for location access
- Ensure HTTPS in production (required for geolocation)
- Test with different browsers

### Distance Not Showing

- Verify PostGIS extension is enabled in Supabase
- Check browser console for SQL errors
- Ensure latitude/longitude data exists in your database

### Performance Issues

- Consider implementing the geography column optimization
- Add database indexes on frequently queried columns
- Implement client-side caching for user location

## Testing

Test the following scenarios:

1. **Allow Location**: Should show distance sorting option
2. **Deny Location**: Should show error message, fallback to name sorting
3. **No Location Data**: Should handle shops without coordinates gracefully
4. **Pagination**: Distance sorting should work across pages
5. **Mobile**: Should work on mobile devices with GPS

The implementation is now complete and ready for use! The distance feature provides a solid foundation for future map integration and advanced geographic features.
