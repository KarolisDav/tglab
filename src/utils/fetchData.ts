const BASE_URL = "https://api.spaceflightnewsapi.net/v4/articles";

export const fetchData = async (
  offset: number,
  limit: number,
  query?: string
) => {
  let url = `${BASE_URL}?offset=${offset}&limit=${limit}`;
  if (query) {
    url += `&title_contains=${encodeURIComponent(query)}`; // Adjust query parameter as needed
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return await response.json();
  } catch (error) {
    const err = error as Error;
    throw new Error(`Error fetching data: ${err.message}`);
  }
};
