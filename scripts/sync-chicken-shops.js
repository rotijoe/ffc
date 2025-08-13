const { createClient } = require('@supabase/supabase-js')

// Use the V2 API endpoint, which is more stable and uses query parameters.
const FSA_API_URL = 'https://api.ratings.food.gov.uk/Establishments'
const FSA_HEADERS = { 'x-api-version': '2', accept: 'application/json' }
const SEARCH_TERM = 'chicken'
const PAGE_SIZE = 1000

// This is a verified list of Local Authority IDs for all 32 London boroughs + City of London.
const LONDON_AUTHORITY_IDS = [
  93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
  110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125
]

// A helper function to add a delay between API calls to avoid rate limiting.
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Fetches all matching establishments for a single London borough
async function fetchAllForAuthority(authorityId) {
  const allEstablishments = []
  let pageNumber = 1
  while (true) {
    // Construct the URL without the businessTypeId filter to get all types.
    const url = `${FSA_API_URL}?name=${SEARCH_TERM}&localAuthorityId=${authorityId}&pageSize=${PAGE_SIZE}&pageNumber=${pageNumber}`
    const res = await fetch(url, { headers: FSA_HEADERS })

    if (!res.ok) {
      console.error(`FSA API error for authority ${authorityId}: ${res.status}`)
      break // Stop for this authority if an error occurs
    }

    const data = await res.json()
    const establishments = data.establishments

    if (!establishments || establishments.length === 0) {
      console.log(`No establishments found for authority ${authorityId}.`)
      break // Exit loop when no more results are returned
    }

    console.log(
      `Found ${establishments.length} establishments for authority ${authorityId}.`
    )
    allEstablishments.push(...establishments)
    pageNumber++
  }
  return allEstablishments
}

// Maps an API record to our database table schema
function mapToDbRow(est, syncTimestamp) {
  return {
    fhrs_id: est.FHRSID,
    business_name: est.BusinessName,
    rating_value: est.RatingValue,
    rating_key: est.RatingKey,
    business_type: est.BusinessType,
    address: [
      est.AddressLine1,
      est.AddressLine2,
      est.AddressLine3,
      est.AddressLine4
    ]
      .filter(Boolean)
      .join(', '),
    postcode: est.PostCode,
    latitude: Number(est.geocode?.latitude ?? 0),
    longitude: Number(est.geocode?.longitude ?? 0),
    last_seen_at: syncTimestamp // Set the timestamp for this sync run
  }
}

async function main() {
  const syncTimestamp = new Date().toISOString() // 1. Record the start time.
  console.log(`Starting sync at: ${syncTimestamp}`)

  try {
    // Connect to local Supabase
    const supabase = createClient(
      'http://127.0.0.1:54321',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
    )

    // Fetch from all London authorities sequentially with a delay to avoid rate limiting.
    const allResults = []
    for (const authorityId of LONDON_AUTHORITY_IDS) {
      console.log(`Fetching data for authority: ${authorityId}`)
      const results = await fetchAllForAuthority(authorityId)
      allResults.push(...results)
      await delay(200) // Add a 200ms delay between each authority call.
    }

    console.log(`Total establishments found: ${allResults.length}`)

    // Filter the results to include both "Takeaway" and "Restaurant" types.
    const desiredBusinessTypes = [7844, 1]
    const filteredResults = allResults.filter((est) =>
      desiredBusinessTypes.includes(est.BusinessTypeID)
    )

    if (filteredResults.length === 0) {
      console.log('No relevant chicken shops found to update.')
      return
    }

    // No extra filtering needed as the API call is now specific.
    const chickenShops = filteredResults.map((est) =>
      mapToDbRow(est, syncTimestamp)
    ) // Pass the timestamp to the mapper.

    // Upsert the data into your table
    const { error: upsertError } = await supabase
      .from('fried_chicken_shops')
      .upsert(chickenShops, { onConflict: 'fhrs_id' })

    if (upsertError) throw upsertError
    console.log(`Successfully upserted ${chickenShops.length} records.`)

    // 3. Sweep: Delete old records that weren't updated in this run.
    const { error: deleteError } = await supabase
      .from('fried_chicken_shops')
      .delete()
      .lt('last_seen_at', syncTimestamp)

    if (deleteError) throw deleteError
    console.log(`Successfully deleted stale records.`)

    console.log(
      `Sync completed successfully! Upserted ${chickenShops.length} records.`
    )
  } catch (err) {
    console.error('Error in sync:', err)
  }
}

main()
