// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Test cases for StreamlinedSchemaExtractorTool evaluation
 * All tests use the streamlined extractor tool
 */
/**
 * Simple structured data test
 */
export const simpleTest = {
    id: 'github-repo-001',
    name: 'Extract GitHub Repository Info',
    description: 'Extract basic repository information from a GitHub page',
    url: 'https://github.com/microsoft/TypeScript',
    tool: 'extract_schema_streamlined',
    input: {
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                language: { type: 'string' },
                stars: { type: 'number' },
                forks: { type: 'number' },
                topics: {
                    type: 'array',
                    items: { type: 'string' }
                },
                readme: {
                    type: 'object',
                    properties: {
                        summary: { type: 'string' }
                    }
                }
            },
            required: ['name', 'description']
        },
        instruction: 'Extract repository metadata and basic statistics',
        reasoning: 'Testing extraction from a well-structured GitHub repository page'
    },
    validation: {
        type: 'hybrid',
        snapshot: {
            excludePaths: ['stars', 'forks'], // These change frequently
            structureOnly: false
        },
        llmJudge: {
            criteria: [
                'Repository name matches the GitHub page',
                'Description accurately reflects the project purpose',
                'Programming language is correctly identified',
                'Topic tags are relevant to the project'
            ],
        }
    },
    metadata: {
        tags: ['github', 'repository', 'structured'],
        timeout: 30000,
        retries: 1,
        flaky: false
    }
};
/**
 * Wikipedia article extraction test
 */
export const wikipediaTest = {
    id: 'wikipedia-chrome-devtools-001',
    name: 'Extract Chrome DevTools Wikipedia Article',
    description: 'Extract structured information from the Chrome DevTools Wikipedia page',
    url: 'https://en.wikipedia.org/wiki/Chrome_DevTools',
    tool: 'extract_schema_streamlined',
    input: {
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                summary: { type: 'string' },
                tableOfContents: {
                    type: 'array',
                    items: { type: 'string' }
                },
                infobox: {
                    type: 'object',
                    properties: {
                        developer: { type: 'string' },
                        initialRelease: { type: 'string' },
                        operatingSystem: { type: 'string' },
                        license: { type: 'string' }
                    }
                },
                externalLinks: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            text: { type: 'string' },
                            url: { type: 'string', format: 'url' }
                        }
                    }
                }
            },
            required: ['title', 'summary']
        },
        instruction: 'Extract the main article information including title, summary, table of contents, and infobox details',
        reasoning: 'Testing extraction from a stable, well-structured Wikipedia page'
    },
    validation: {
        type: 'hybrid',
        snapshot: {
            excludePaths: ['externalLinks[*].url'],
            structureOnly: false
        },
        llmJudge: {
            criteria: [
                'Article title matches the Wikipedia page title',
                'Summary captures the main description of Chrome DevTools',
                'Table of contents includes major sections',
                'Infobox contains key technical details',
                'External links are properly resolved URLs'
            ],
        }
    },
    metadata: {
        tags: ['wikipedia', 'documentation', 'stable'],
        timeout: 45000,
        retries: 2,
        flaky: false
    }
};
/**
 * E-commerce product extraction test
 */
export const ecommerceTest = {
    id: 'amazon-product-001',
    name: 'Extract Amazon Product Details',
    description: 'Extract product information from an Amazon product page',
    url: 'https://www.amazon.com/Obelisk-Climbing-Rustproof-Trellises-Clematis/dp/B0B4SBY6QD/',
    tool: 'extract_schema_streamlined',
    input: {
        schema: {
            type: 'object',
            properties: {
                product: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        brand: { type: 'string' },
                        price: {
                            type: 'object',
                            properties: {
                                current: { type: 'number' },
                                currency: { type: 'string' }
                            }
                        },
                        rating: {
                            type: 'object',
                            properties: {
                                average: { type: 'number' },
                                count: { type: 'number' }
                            }
                        },
                        images: {
                            type: 'array',
                            items: { type: 'string', format: 'url' }
                        },
                        features: {
                            type: 'array',
                            items: { type: 'string' }
                        }
                    },
                    required: ['title', 'price']
                },
                availability: { type: 'string' }
            },
            required: ['product']
        },
        instruction: 'Extract comprehensive product information including pricing, ratings, and key features',
        reasoning: 'Testing extraction from a dynamic e-commerce page with complex structure'
    },
    validation: {
        type: 'llm-judge',
        llmJudge: {
            criteria: [
                'Product title is accurate and complete',
                'Price information is current and properly formatted',
                'Rating data includes both average and review count',
                'Image URLs are valid and accessible',
                'Key product features are captured',
                'All URLs are properly resolved (not node IDs)'
            ],
        }
    },
    metadata: {
        tags: ['ecommerce', 'amazon', 'product', 'dynamic'],
        timeout: 60000,
        retries: 3,
        flaky: true // E-commerce pages can be dynamic
    }
};
/**
 * News article extraction test
 */
export const newsTest = {
    id: 'bbc-news-001',
    name: 'Extract BBC News Article',
    description: 'Extract article content and metadata from a BBC News page',
    url: 'https://www.bbc.com/news/technology',
    tool: 'extract_schema_streamlined',
    input: {
        schema: {
            type: 'object',
            properties: {
                headlines: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            summary: { type: 'string' },
                            url: { type: 'string', format: 'url' },
                            category: { type: 'string' }
                        },
                        required: ['title']
                    }
                },
                mainStory: {
                    type: 'object',
                    properties: {
                        headline: { type: 'string' },
                        summary: { type: 'string' },
                        url: { type: 'string', format: 'url' }
                    }
                }
            },
            required: ['headlines']
        },
        instruction: 'Extract the main headlines and featured stories from the BBC Technology news section',
        reasoning: 'Testing extraction from a news aggregation page with multiple articles'
    },
    validation: {
        type: 'llm-judge',
        llmJudge: {
            criteria: [
                'Headlines are current and relevant to technology news',
                'Article summaries provide meaningful context',
                'URLs link to valid BBC news articles',
                'Main story is properly identified',
                'All extracted content is in English'
            ],
            includeUrl: true
        }
    },
    metadata: {
        tags: ['news', 'bbc', 'aggregation', 'dynamic'],
        timeout: 30000,
        retries: 2,
        flaky: true // News content changes frequently
    }
};
/**
 * Google Search results extraction test
 */
export const googleSearchTest = {
    id: 'google-search-001',
    name: 'Extract Google Search Results',
    description: 'Extract search results from Google search page',
    url: 'https://www.google.com/search?q=chrome+devtools+tutorial',
    tool: 'extract_schema_streamlined',
    input: {
        schema: {
            type: 'object',
            properties: {
                query: { type: 'string' },
                searchResults: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            url: { type: 'string', format: 'url' },
                            snippet: { type: 'string' },
                            domain: { type: 'string' }
                        },
                        required: ['title', 'url', 'snippet']
                    }
                },
                featuredSnippet: {
                    type: 'object',
                    properties: {
                        content: { type: 'string' },
                        source: { type: 'string' },
                        url: { type: 'string', format: 'url' }
                    }
                },
                relatedSearches: {
                    type: 'array',
                    items: { type: 'string' }
                }
            },
            required: ['searchResults']
        },
        instruction: 'Extract the top 10 search results with titles, URLs, and snippets. Also extract featured snippet if present and related searches',
        reasoning: 'Testing extraction from Google search results page with various result types'
    },
    validation: {
        type: 'llm-judge',
        llmJudge: {
            criteria: [
                'Search results are relevant to the query',
                'Each result has a valid title, URL, and snippet',
                'URLs are properly resolved and not node IDs',
                'Related searches are extracted if present',
                'Featured snippet is captured when available'
            ],
        }
    },
    metadata: {
        tags: ['search', 'google', 'serp', 'dynamic'],
        timeout: 45000,
        retries: 2,
        flaky: true
    }
};
/**
 * Bing Search results extraction test
 */
export const bingSearchTest = {
    id: 'bing-search-001',
    name: 'Extract Bing Search Results',
    description: 'Extract search results from Bing search page',
    url: 'https://www.bing.com/search?q=web+scraping+best+practices',
    tool: 'extract_schema_streamlined',
    input: {
        schema: {
            type: 'object',
            properties: {
                query: { type: 'string' },
                searchResults: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            url: { type: 'string', format: 'url' },
                            snippet: { type: 'string' },
                            datePublished: { type: 'string' }
                        },
                        required: ['title', 'url', 'snippet']
                    }
                },
                sidebarInfo: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        source: { type: 'string' }
                    }
                }
            },
            required: ['searchResults']
        },
        instruction: 'Extract search results including titles, URLs, snippets, and any sidebar information from Bing',
        reasoning: 'Testing extraction from Bing search results with different layout than Google'
    },
    validation: {
        type: 'llm-judge',
        llmJudge: {
            criteria: [
                'Search results match the query intent',
                'Results include valid URLs and meaningful snippets',
                'Sidebar information is extracted when present',
                'No duplicate results in the list'
            ],
        }
    },
    metadata: {
        tags: ['search', 'bing', 'serp', 'dynamic'],
        timeout: 45000,
        retries: 2,
        flaky: true
    }
};
/**
 * Wikipedia search results extraction test
 */
export const wikipediaSearchTest = {
    id: 'wikipedia-search-001',
    name: 'Extract Wikipedia Search Results',
    description: 'Extract search results from Wikipedia search',
    url: 'https://en.wikipedia.org/w/index.php?search=artificial+intelligence&title=Special:Search',
    tool: 'extract_schema_streamlined',
    input: {
        schema: {
            type: 'object',
            properties: {
                searchTerm: { type: 'string' },
                resultCount: { type: 'number' },
                searchResults: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            url: { type: 'string', format: 'url' },
                            snippet: { type: 'string' },
                            category: { type: 'string' },
                            wordCount: { type: 'number' },
                            lastEdited: { type: 'string' }
                        },
                        required: ['title', 'url', 'snippet']
                    }
                },
                suggestedArticles: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            url: { type: 'string', format: 'url' }
                        }
                    }
                }
            },
            required: ['searchResults']
        },
        instruction: 'Extract Wikipedia search results including article titles, URLs, snippets, and metadata like word count or last edit date',
        reasoning: 'Testing extraction from Wikipedia\'s internal search with rich metadata'
    },
    validation: {
        type: 'llm-judge',
        llmJudge: {
            criteria: [
                'Search results are Wikipedia articles',
                'Each result has a valid Wikipedia URL',
                'Snippets contain relevant content highlights',
                'Metadata like word count is extracted when available'
            ],
        }
    },
    metadata: {
        tags: ['search', 'wikipedia', 'encyclopedia'],
        timeout: 30000,
        retries: 2,
        flaky: false
    }
};
/**
 * Home Depot product search extraction test
 */
export const homeDepotTest = {
    id: 'homedepot-001',
    name: 'Extract Home Depot Product Search',
    description: 'Extract product listings from Home Depot search results',
    url: 'https://www.homedepot.com/s/power%2520drill',
    tool: 'extract_schema_streamlined',
    input: {
        schema: {
            type: 'object',
            properties: {
                searchQuery: { type: 'string' },
                totalResults: { type: 'number' },
                products: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            brand: { type: 'string' },
                            price: { type: 'number' },
                            originalPrice: { type: 'number' },
                            savings: { type: 'number' },
                            rating: { type: 'number' },
                            reviewCount: { type: 'number' },
                            productUrl: { type: 'string', format: 'url' },
                            imageUrl: { type: 'string', format: 'url' },
                            availability: { type: 'string' },
                            features: {
                                type: 'array',
                                items: { type: 'string' }
                            }
                        },
                        required: ['name', 'price', 'productUrl']
                    }
                },
                filters: {
                    type: 'object',
                    properties: {
                        brands: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        priceRanges: {
                            type: 'array',
                            items: { type: 'string' }
                        }
                    }
                }
            },
            required: ['products']
        },
        instruction: 'Extract product listings from Home Depot search results including prices, ratings, and availability',
        reasoning: 'Testing extraction from e-commerce search results with product cards and filters'
    },
    validation: {
        type: 'llm-judge',
        llmJudge: {
            criteria: [
                'Products are relevant to the search query',
                'Prices are numeric values in USD',
                'Product URLs link to Home Depot product pages',
                'Ratings are on a 5-star scale',
                'Key product features are captured'
            ],
        }
    },
    metadata: {
        tags: ['ecommerce', 'homedepot', 'products', 'search'],
        timeout: 60000,
        retries: 3,
        flaky: true
    }
};
/**
 * Macy's product listing extraction test
 */
export const macysTest = {
    id: 'macys-001',
    name: 'Extract Macy\'s Product Listings',
    description: 'Extract fashion products from Macy\'s category page',
    url: 'https://www.macys.com/shop/womens-clothing/womens-dresses',
    tool: 'extract_schema_streamlined',
    input: {
        schema: {
            type: 'object',
            properties: {
                category: { type: 'string' },
                totalProducts: { type: 'number' },
                products: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            brand: { type: 'string' },
                            currentPrice: { type: 'number' },
                            originalPrice: { type: 'number' },
                            discount: { type: 'string' },
                            colors: {
                                type: 'array',
                                items: { type: 'string' }
                            },
                            sizes: {
                                type: 'array',
                                items: { type: 'string' }
                            },
                            rating: { type: 'number' },
                            reviewCount: { type: 'number' },
                            productUrl: { type: 'string', format: 'url' },
                            imageUrl: { type: 'string', format: 'url' },
                            promotions: {
                                type: 'array',
                                items: { type: 'string' }
                            }
                        },
                        required: ['name', 'brand', 'currentPrice']
                    }
                },
                refinements: {
                    type: 'object',
                    properties: {
                        brands: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        sizes: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        colors: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        priceRanges: {
                            type: 'array',
                            items: { type: 'string' }
                        }
                    }
                }
            },
            required: ['products']
        },
        instruction: 'Extract fashion products including prices, sizes, colors, and promotional offers from Macy\'s',
        reasoning: 'Testing extraction from fashion e-commerce with complex product attributes'
    },
    validation: {
        type: 'llm-judge',
        llmJudge: {
            criteria: [
                'Products are from the correct category',
                'Prices reflect current and sale prices',
                'Color and size options are captured',
                'Brand names are accurately extracted',
                'Promotional text is included when present'
            ],
        }
    },
    metadata: {
        tags: ['ecommerce', 'macys', 'fashion', 'products'],
        timeout: 60000,
        retries: 3,
        flaky: true
    }
};
/**
 * Google Flights search extraction test
 */
export const googleFlightsTest = {
    id: 'google-flights-001',
    name: 'Extract Google Flights Search Results',
    description: 'Extract flight options from Google Flights search',
    url: 'https://www.google.com/travel/flights/search?tfs=CBwQAhojEgoyMDI1LTEyLTI0agwIAhIIL20vMGQ5anJyBwgBEgNTRk8aIxIKMjAyNS0xMi0zMWoHCAESA1NGT3IMCAISCC9tLzBkOWpyQAFIAXABggELCP___________wGYAQE',
    tool: 'extract_schema_streamlined',
    input: {
        schema: {
            type: 'object',
            properties: {
                searchCriteria: {
                    type: 'object',
                    properties: {
                        origin: { type: 'string' },
                        destination: { type: 'string' },
                        departureDate: { type: 'string' },
                        returnDate: { type: 'string' },
                        tripType: { type: 'string' },
                        passengers: { type: 'number' }
                    }
                },
                flights: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            airline: { type: 'string' },
                            flightNumber: { type: 'string' },
                            departureTime: { type: 'string' },
                            arrivalTime: { type: 'string' },
                            duration: { type: 'string' },
                            stops: { type: 'number' },
                            price: {
                                type: 'object',
                                properties: {
                                    amount: { type: 'number' },
                                    currency: { type: 'string' }
                                }
                            },
                            cabin: { type: 'string' },
                            bookingUrl: { type: 'string', format: 'url' },
                            legroom: { type: 'string' },
                            amenities: {
                                type: 'array',
                                items: { type: 'string' }
                            }
                        },
                        required: ['airline', 'departureTime', 'arrivalTime', 'price']
                    }
                },
                priceInsights: {
                    type: 'object',
                    properties: {
                        trend: { type: 'string' },
                        recommendation: { type: 'string' },
                        averagePrice: { type: 'number' }
                    }
                }
            },
            required: ['flights']
        },
        instruction: 'Extract flight options including airlines, times, prices, and amenities from Google Flights results',
        reasoning: 'Testing extraction from complex travel search interface with dynamic pricing'
    },
    validation: {
        type: 'llm-judge',
        llmJudge: {
            criteria: [
                'Flight times are in proper format',
                'Prices are numeric values with currency',
                'Airlines and flight numbers are accurate',
                'Stop information is correctly identified',
                'Duration is in readable format'
            ],
        }
    },
    metadata: {
        tags: ['travel', 'flights', 'google', 'booking'],
        timeout: 60000,
        retries: 2,
        flaky: true
    }
};
/**
 * All test cases for StreamlinedSchemaExtractorTool
 */
export const streamlinedSchemaExtractorTests = [
    simpleTest, // Start with simplest
    wikipediaTest, // Stable, well-structured
    newsTest, // Dynamic content
    ecommerceTest, // Amazon product
    googleSearchTest, // Google SERP
    bingSearchTest, // Bing SERP
    wikipediaSearchTest, // Wikipedia search
    homeDepotTest, // Home Depot products
    macysTest, // Macy's fashion
    googleFlightsTest, // Google Flights
];
/**
 * Get a specific test by ID
 */
export function getTestById(id) {
    return streamlinedSchemaExtractorTests.find(test => test.id === id);
}
/**
 * Get tests by tag
 */
export function getTestsByTag(tag) {
    return streamlinedSchemaExtractorTests.filter(test => test.metadata.tags.includes(tag));
}
//# sourceMappingURL=streamlined-schema-extractor-tests.js.map