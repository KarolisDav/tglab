import React, {useState, useEffect, useRef} from "react";
import useArticlesData from "../hooks/useArticlesData";
import debounce from "lodash/debounce";
import {StyledInput} from "./styled/StyledInput.styled";
import {StyledUl} from "./styled/StyledUl.styled";
import {StyledImg} from "./styled/StyledImg.styled";
import {StyledLi} from "./styled/StyledLi.styled";

const ArticleList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const {articles, isLoading, error, hasMore, setOffset} =
    useArticlesData(searchQuery);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const debouncedSearch = useRef(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 300)
  ).current;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        setOffset((prevOffset) => prevOffset + 10);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    const currentLoaderRef = loaderRef.current;

    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [hasMore, isLoading, setOffset, articles.length]);

  if (isLoading && articles.length === 0) {
    return <p>Loading articles...</p>;
  }

  if (error) {
    return <p>Error fetching articles: {error}</p>;
  }

  const noResultsFound = articles.length === 0 && searchQuery.trim() !== "";

  return (
    <>
      <StyledInput
        type="text"
        placeholder="Search articles..."
        onChange={handleSearchChange}
      />
      {noResultsFound && <p>No articles found matching "{searchQuery}".</p>}
      <StyledUl>
        {articles.map((article) => (
          <StyledLi key={article.id}>
            <StyledImg src={article.image_url} alt={article.title} />
            <h2 style={{fontSize: "1.2em"}}>{article.title}</h2>
            <p>{article.news_site}</p>
          </StyledLi>
        ))}
      </StyledUl>
      {isLoading && <p>Loading more articles...</p>}
      <div ref={loaderRef} />
    </>
  );
};

export default ArticleList;
