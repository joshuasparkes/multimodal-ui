"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";

const API_BASE_URL = "http://localhost:8080";

function RoutesApp() {
  const [originOptions, setOriginOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchingOrigin, setSearchingOrigin] = useState(false);
  const [searchingDestination, setSearchingDestination] = useState(false);
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [showOriginOptions, setShowOriginOptions] = useState(false);
  const [showDestinationOptions, setShowDestinationOptions] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const searchPlaces = async (query) => {
    if (!query || query.length < 2) return [];

    try {
      console.log(`Searching for places with query: "${query}"`);
      const response = await axios.get(`${API_BASE_URL}/places/search`, {
        params: { q: query },
      });
      console.log("Places search response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error searching places:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return [];
    }
  };

  const handleOriginSearch = async (value) => {
    setOriginQuery(value);
    if (value && value.length >= 2) {
      setSearchingOrigin(true);
      console.log(`Starting origin search for: "${value}"`);
      const places = await searchPlaces(value);
      console.log(`Origin search returned ${places.length} places:`, places);
      setOriginOptions(places);
      setSearchingOrigin(false);
      setShowOriginOptions(places.length > 0);
    } else {
      setShowOriginOptions(false);
      setOriginOptions([]);
    }
  };

  const handleDestinationSearch = async (value) => {
    setDestinationQuery(value);
    if (value && value.length >= 2) {
      setSearchingDestination(true);
      console.log(`Starting destination search for: "${value}"`);
      const places = await searchPlaces(value);
      console.log(
        `Destination search returned ${places.length} places:`,
        places
      );
      setDestinationOptions(places);
      setSearchingDestination(false);
      setShowDestinationOptions(places.length > 0);
    } else {
      setShowDestinationOptions(false);
      setDestinationOptions([]);
    }
  };

  const selectOrigin = (option) => {
    setSelectedOrigin(option);
    setOriginQuery(`${option.name} (${option.country_code})`);
    setShowOriginOptions(false);
  };

  const selectDestination = (option) => {
    setSelectedDestination(option);
    setDestinationQuery(`${option.name} (${option.country_code})`);
    setShowDestinationOptions(false);
  };

  const findRoutes = async () => {
    if (!selectedOrigin || !selectedDestination) {
      setError("Please select both origin and destination");
      return;
    }

    setLoading(true);
    setError("");
    setRoutes([]);

    try {
      const response = await axios.post(`${API_BASE_URL}/routes/find`, {
        origin_id: selectedOrigin.id,
        destination_id: selectedDestination.id,
        max_routes: 5,
      });

      console.log("Routes API response:", response.data);
      console.log("Routes array:", response.data.routes);

      setRoutes(response.data.routes);

      if (response.data.routes.length === 0) {
        setError("No routes found between these locations");
      }
    } catch (error) {
      setError(
        `Error finding routes: ${error.response?.data?.detail || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (km) => {
    return `${Math.round(km)} km`;
  };

  const getProviderColor = (provider) => {
    switch (provider) {
      case "Trainline":
        return "#1976d2";
      case "Benerail":
        return "#dc004e";
      default:
        return "#333";
    }
  };

  const getUniqueProviders = (segments) => {
    const providers = segments.map((segment) => segment.provider);
    return [...new Set(providers)];
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 className="text-center text-4xl mb-2 text-gray-800 flex items-center justify-center gap-3">
          <Image
            src="/favicon.ico"
            alt="Junction Route Planner"
            width={40}
            height={40}
            className="rounded-md"
          />
          Junction Route Planner
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#555",
            marginBottom: "2rem",
            fontSize: "1.1rem",
          }}
        >
          Find routes between places across Europe
        </p>

        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "1rem",
              alignItems: "end",
            }}
          >
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Origin Station
              </label>
              <input
                type="text"
                value={originQuery}
                onChange={(e) => handleOriginSearch(e.target.value)}
                placeholder="Type to search..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  color: "#333",
                  backgroundColor: "white",
                }}
              />
              {searchingOrigin && (
                <div
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "2.25rem",
                    color: "#555",
                  }}
                >
                  Loading...
                </div>
              )}
              {showOriginOptions && originOptions.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderTop: "none",
                    borderRadius: "0 0 4px 4px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 1000,
                  }}
                >
                  {originOptions.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => selectOrigin(option)}
                      style={{
                        padding: "0.75rem",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        color: "#333",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#f5f5f5")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "white")
                      }
                    >
                      <div style={{ fontWeight: "500", color: "#333" }}>
                        {option.name}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#666" }}>
                        {option.country_code} •{" "}
                        {option.providers?.join(", ") || "Unknown"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Destination Station
              </label>
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => handleDestinationSearch(e.target.value)}
                placeholder="Type to search..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  color: "#333",
                  backgroundColor: "white",
                }}
              />
              {searchingDestination && (
                <div
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "2.25rem",
                    color: "#555",
                  }}
                >
                  Loading...
                </div>
              )}
              {showDestinationOptions && destinationOptions.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderTop: "none",
                    borderRadius: "0 0 4px 4px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 1000,
                  }}
                >
                  {destinationOptions.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => selectDestination(option)}
                      style={{
                        padding: "0.75rem",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        color: "#333",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#f5f5f5")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "white")
                      }
                    >
                      <div style={{ fontWeight: "500", color: "#333" }}>
                        {option.name}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#666" }}>
                        {option.country_code} •{" "}
                        {option.providers?.join(", ") || "Unknown"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={findRoutes}
              disabled={loading || !selectedOrigin || !selectedDestination}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor:
                  loading || !selectedOrigin || !selectedDestination
                    ? "#ccc"
                    : "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                cursor:
                  loading || !selectedOrigin || !selectedDestination
                    ? "not-allowed"
                    : "pointer",
                height: "3rem",
              }}
            >
              {loading ? "Finding..." : "Find Routes"}
            </button>
          </div>
        </div>

        {/* Notes Section */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "2rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <button
            onClick={() => setShowNotes(!showNotes)}
            style={{
              width: "100%",
              padding: "1rem 1.5rem",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "8px 8px 0 0",
              fontSize: "1.1rem",
              fontWeight: "500",
              color: "#333",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            <span>📋 Routes Service - Current Status & Capabilities</span>
            <span style={{ fontSize: "1.2rem" }}>{showNotes ? "−" : "+"}</span>
          </button>

          {showNotes && (
            <div style={{ padding: "0 1.5rem 1.5rem" }}>
              {/* What's Working */}
              <div style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    color: "#28a745",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                  }}
                >
                  ✅ What&apos;s Working
                </h3>

                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>
                    Core Functionality
                  </h4>
                  <ul
                    style={{
                      color: "#555",
                      lineHeight: "1.6",
                      paddingLeft: "1.5rem",
                    }}
                  >
                    <li>
                      Cross-provider railway routing between Trainline (UK) and
                      Benerail (Europe)
                    </li>
                    <li>
                      Station search with autocomplete (731K+ railway stations)
                    </li>
                    <li>Multi-hop routing with automatic provider transfers</li>
                    <li>REST API with CORS support for frontend integration</li>
                  </ul>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>
                    Geographic Coverage
                  </h4>
                  <ul
                    style={{
                      color: "#555",
                      lineHeight: "1.6",
                      paddingLeft: "1.5rem",
                    }}
                  >
                    <li>Germany → United Kingdom routing ✅</li>
                    <li>
                      European Union stations (France, Belgium, Netherlands,
                      Germany)
                    </li>
                    <li>United Kingdom stations</li>
                    <li>
                      Transfer hubs: London St. Pancras, Ebbsfleet, Ashford
                      International
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>
                    Technical Features
                  </h4>
                  <ul
                    style={{
                      color: "#555",
                      lineHeight: "1.6",
                      paddingLeft: "1.5rem",
                    }}
                  >
                    <li>Fast startup (~10-30 seconds graph building)</li>
                    <li>
                      Optimized pathfinding (BFS algorithm, ~5-15 seconds per
                      route)
                    </li>
                    <li>
                      Smart station filtering (loads ~93 relevant stations vs
                      731K total)
                    </li>
                    <li>
                      Distance-based connections (200km domestic, 800km
                      international)
                    </li>
                  </ul>
                </div>
              </div>

              {/* Current Limitations */}
              <div style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    color: "#ffc107",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                  }}
                >
                  🚧 Current Limitations
                </h3>

                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>
                    Geographic Gaps
                  </h4>
                  <ul
                    style={{
                      color: "#555",
                      lineHeight: "1.6",
                      paddingLeft: "1.5rem",
                    }}
                  >
                    <li>
                      No coverage for: Spain, Italy, Eastern Europe, Scandinavia
                    </li>
                    <li>Limited to: DE/FR/BE/NL → GB routes only</li>
                    <li>
                      Missing providers: SNCF, Trenitalia, Renfe, SJ, etc.
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>
                    Route Quality
                  </h4>
                  <ul
                    style={{
                      color: "#555",
                      lineHeight: "1.6",
                      paddingLeft: "1.5rem",
                    }}
                  >
                    <li>
                      Distance-based only - no time, cost, or schedule data
                    </li>
                    <li>
                      No real timetables - shows possible connections, not
                      actual departures
                    </li>
                    <li>
                      No booking integration - routes are informational only
                    </li>
                    <li>
                      Basic transfer logic - assumes all transfers are possible
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>
                    Data Limitations
                  </h4>
                  <ul
                    style={{
                      color: "#555",
                      lineHeight: "1.6",
                      paddingLeft: "1.5rem",
                    }}
                  >
                    <li>Static station data - no real-time updates</li>
                    <li>
                      Provider mappings incomplete - some stations may be
                      missing
                    </li>
                    <li>
                      No accessibility info - wheelchair access, facilities,
                      etc.
                    </li>
                    <li>
                      No route preferences - fastest vs cheapest vs fewest
                      transfers
                    </li>
                  </ul>
                </div>
              </div>

              {/* API Endpoints */}
              <div style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    color: "#17a2b8",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                  }}
                >
                  🎯 API Endpoints
                </h3>

                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>
                    Station Search
                  </h4>
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      fontFamily: "monospace",
                      fontSize: "0.9rem",
                      color: "#333",
                    }}
                  >
                    GET /places/search?q=&lt;query&gt;
                  </div>
                  <p
                    style={{
                      color: "#555",
                      fontSize: "0.9rem",
                      margin: "0.5rem 0",
                    }}
                  >
                    Returns stations matching query with coordinates and
                    provider info.
                  </p>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>
                    Route Finding
                  </h4>
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      fontFamily: "monospace",
                      fontSize: "0.9rem",
                      color: "#333",
                    }}
                  >
                    POST /routes/find
                  </div>
                  <p
                    style={{
                      color: "#555",
                      fontSize: "0.9rem",
                      margin: "0.5rem 0",
                    }}
                  >
                    Returns possible routes with segments, distances, and
                    transfer points.
                  </p>
                </div>

                <div>
                  <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>
                    Health Check
                  </h4>
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      fontFamily: "monospace",
                      fontSize: "0.9rem",
                      color: "#333",
                    }}
                  >
                    GET /health
                  </div>
                  <p
                    style={{
                      color: "#555",
                      fontSize: "0.9rem",
                      margin: "0.5rem 0",
                    }}
                  >
                    Service status check.
                  </p>
                </div>
              </div>

              {/* Performance Characteristics */}
              <div>
                <h3
                  style={{
                    color: "#6f42c1",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                  }}
                >
                  📊 Performance Characteristics
                </h3>
                <ul
                  style={{
                    color: "#555",
                    lineHeight: "1.6",
                    paddingLeft: "1.5rem",
                  }}
                >
                  <li>Graph building: 10-30 seconds (one-time on startup)</li>
                  <li>Station search: &lt;1 second (autocomplete-friendly)</li>
                  <li>Route finding: 5-15 seconds (depends on complexity)</li>
                  <li>Memory usage: ~50-100MB (optimized station subset)</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "1rem",
              borderRadius: "4px",
              marginBottom: "1.5rem",
              border: "1px solid #ffcdd2",
            }}
          >
            {error}
          </div>
        )}

        {routes.length > 0 && (
          <div>
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>
              Found {routes.length} route{routes.length !== 1 ? "s" : ""}
            </h2>

            {routes.map((route, routeIndex) => (
              <div
                key={routeIndex}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 style={{ color: "#333" }}>Route {routeIndex + 1}</h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#666" }}>
                      {formatDistance(route.total_distance)}
                    </span>
                    {getUniqueProviders(route.segments).map((provider) => (
                      <span
                        key={provider}
                        style={{
                          backgroundColor: getProviderColor(provider),
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                        }}
                      >
                        🚄 {provider}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  {route.segments.map((segment, segmentIndex) => (
                    <div
                      key={segmentIndex}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.5rem 0",
                        borderBottom:
                          segmentIndex < route.segments.length - 1
                            ? "1px solid #eee"
                            : "none",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "500", color: "#333" }}>
                          {segment.origin_name} → {segment.destination_name}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#666" }}>
                          {formatDistance(segment.distance)}
                        </div>
                      </div>
                      <span
                        style={{
                          border: `1px solid ${getProviderColor(
                            segment.provider
                          )}`,
                          color: getProviderColor(segment.provider),
                          padding: "0.25rem 0.5rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                        }}
                      >
                        {segment.provider}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && routes.length === 0 && !error && (
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "3rem",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚄</div>
            <h3 style={{ color: "#666" }}>
              Select origin and destination to find routes
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoutesApp;
