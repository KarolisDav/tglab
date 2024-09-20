import {useEffect, useState, useCallback} from "react";
import {fetchData} from "../utils/fetchData";

export interface Article {
  id: number;
  title: string;
  image_url: string;
  news_site: string;
}

const useArticlesData = (searchQuery: string) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [limit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchArticles = useCallback(
    async (offset: number, limit: number, query: string) => {
      try {
        const data = await fetchData(offset, limit, query);

        if (data.results.length === 0) {
          setHasMore(false);
        } else {
          setArticles((prevArticles) => {
            if (offset === 0) {
              return data.results;
            } else {
              const existingIds = new Set(
                prevArticles.map((article) => article.id)
              );
              const newArticles = data.results.filter(
                (article: Article) => !existingIds.has(article.id)
              );
              return [...prevArticles, ...newArticles];
            }
          });
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setIsLoading(true);

    fetchArticles(0, limit, searchQuery);
  }, [searchQuery, limit, fetchArticles]);

  useEffect(() => {
    if (offset === 0) return;

    fetchArticles(offset, limit, searchQuery);
  }, [offset, limit, searchQuery, fetchArticles]);

  return {articles, isLoading, error, hasMore, setOffset};
};

export default useArticlesData;
