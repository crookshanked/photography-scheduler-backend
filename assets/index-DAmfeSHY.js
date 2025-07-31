import { r as reactExports, j as jsxRuntimeExports, D as DataTable, a as jszip, p as pdfmake, E as Exporter, u as useNavigate, L as Link, b as useParams, d as distExports, H as HashRouter, R as Routes, c as Route, e as ReactDOM, f as React } from "./vendor-DjmTLX_b.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const DataContext = reactExports.createContext(void 0);
const DataProvider = ({ children }) => {
  const [events, setEvents] = reactExports.useState([]);
  const [pastEvents, setPastEvents] = reactExports.useState([]);
  const [entries, setEntries] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKeyResponse = await fetch("api/get-key.php");
        if (!apiKeyResponse.ok) {
          const errorResult = await apiKeyResponse.json();
          throw new Error(errorResult.message || `API Key fetch failed: ${apiKeyResponse.statusText}`);
        }
        const apiKeyResult = await apiKeyResponse.json();
        if (apiKeyResult.status !== "success" || !apiKeyResult.apiKey) {
          throw new Error(apiKeyResult.message || "Invalid API key response.");
        }
        const apiKey = apiKeyResult.apiKey;
        const [eventsResponse, entriesResponse] = await Promise.all([
          fetch(`api/api.php?api_key=${apiKey}&action=get_events`),
          fetch(`api/api.php?api_key=${apiKey}&action=get_entries`)
        ]);
        if (!eventsResponse.ok) {
          throw new Error(`Failed to fetch events: ${eventsResponse.statusText}`);
        }
        if (!entriesResponse.ok) {
          throw new Error(`Failed to fetch entries: ${entriesResponse.statusText}`);
        }
        const eventsResult = await eventsResponse.json();
        const entriesResult = await entriesResponse.json();
        if (eventsResult.status !== "success" || !Array.isArray(eventsResult.data)) {
          throw new Error(eventsResult.message || "Invalid event data received.");
        }
        if (entriesResult.status !== "success" || !Array.isArray(entriesResult.data)) {
          throw new Error(entriesResult.message || "Invalid entry data received.");
        }
        const fetchedEvents = eventsResult.data;
        const processedEntries = entriesResult.data.map((item) => {
          const formatTime = (timeString) => {
            if (!timeString) return "";
            const [hour, minute] = timeString.split(":");
            const hourNum = parseInt(hour, 10);
            const ampm = hourNum >= 12 ? "PM" : "AM";
            const formattedHour = hourNum % 12 || 12;
            return `${formattedHour}:${minute} ${ampm}`;
          };
          const formatDate = (dateString) => {
            if (!dateString || !dateString.includes("-")) return dateString;
            const [, month, day] = dateString.split("-");
            return `${parseInt(month, 10)}-${parseInt(day, 10)}`;
          };
          return {
            entry_id: item.entry_id,
            parent_event_id: item.parent_event_id,
            originalDate: item.date,
            date: formatDate(item.date),
            studentFirstName: item.student_first_name,
            studentLastName: item.student_last_name,
            reason: item.reason,
            comments: item.comments,
            start_time: item.start_time,
            end_time: item.end_time,
            timeframe: `${formatTime(item.start_time)} - ${formatTime(item.end_time)}`,
            name: `${item.student_first_name} ${item.student_last_name}`,
            done: item.done
            // Default 'done' status to false
          };
        });
        const now = /* @__PURE__ */ new Date();
        now.setHours(0, 0, 0, 0);
        const upcomingEvents = fetchedEvents.filter((event) => new Date(event.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const pastEventsData = fetchedEvents.filter((event) => new Date(event.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEvents(upcomingEvents);
        setPastEvents(pastEventsData);
        setEntries(processedEntries);
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch schedule data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const getEventById = (event_id) => events.find((e) => e.event_id === event_id) || pastEvents.find((e) => e.event_id === event_id);
  const getEntriesByEventId = (parent_event_id) => {
    return entries.filter((entry) => entry.parent_event_id === parent_event_id).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  const getEntryById = (entry_id) => entries.find((e) => e.entry_id === entry_id);
  const updateEntryDoneStatus = (entry_id, done) => {
    setEntries(
      (prevEntries) => prevEntries.map(
        (entry) => entry.entry_id === entry_id ? { ...entry, done } : entry
      )
    );
  };
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 text-red-500", children: [
      "Error loading data: ",
      error
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DataContext.Provider, { value: { events, pastEvents, entries, loading, getEventById, getEntriesByEventId, getEntryById, updateEntryDoneStatus }, children });
};
const useData = () => {
  const context = reactExports.useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
const StanleyLogo = "" + new URL("StanleyStudiosLLC-white-small-BPR0bn_S.png", import.meta.url).href;
const LoadingScreen = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm text-center", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 mr-4 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: StanleyLogo, alt: "Stanley Studios LLC Logo", className: "h-16 md:h-20 w-auto" }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-light app-title text-gray-700 dark:text-gray-300 my-6", children: "Photography Schedule" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-sm loader-wrapper overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#6c948f] text-sm font-medium text-white text-center p-1 loader-bar leading-none", style: { width: "70%" }, children: "Loading..." }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "copyright text-gray-500 dark:text-gray-700 mt-12 text-sm", children: [
    "(c) ",
    (/* @__PURE__ */ new Date()).getFullYear(),
    " Stanley Studios, LLC."
  ] })
] }) });
const Layout = ({ children, loading }) => {
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingScreen, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen font-sans", children: /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "container mx-auto px-4 py-4", children }) });
};
const Header = ({ title, subtitle }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "w-full p-2 md:p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center justify-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 mr-4 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: StanleyLogo, alt: "Stanley Studios LLC Logo", className: "h-16 md:h-20 w-auto" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center md:text-left mt-4 md:mt-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "app-title text-3xl md:text-5xl font-light text-gray-800 dark:text-gray-200", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg md:text-xl text-gray-600 dark:text-gray-400 mt-2", children: subtitle })
    ] })
  ] }) });
};
DataTable.Buttons.jszip(jszip);
DataTable.Buttons.pdfMake(pdfmake);
Exporter.use(DataTable);
const EventTable = ({ events }) => {
  const navigate = useNavigate();
  const handleRowClick = (eventId) => {
    console.log("handleRowClick(): ");
    console.log(eventId);
    navigate(`/event-entries/${eventId}`);
  };
  const columns = [
    {
      title: "Actions",
      data: "event_id",
      render: (data, type, row) => {
        return `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded view-entries-btn" data-event-id="${row.event_id}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16"><path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z" fill="white"/></svg></button>`;
      },
      createdCell: (cell, cellData, rowData) => {
        const button = cell.querySelector(".view-entries-btn");
        if (button) {
          button.addEventListener("click", () => {
            handleRowClick(rowData.event_id);
          });
        }
      }
    },
    { title: "Date", data: "date" },
    { title: "Name", data: "name" },
    { title: "Location", data: "location" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Exporter,
    {
      data: events,
      columns,
      options: {
        language: {
          search: "Search:",
          searchPlaceholder: "Name, Date, or Location",
          columnControl: {
            colVis: void 0,
            colVisDropdown: void 0,
            dropdown: void 0,
            orderAddAsc: void 0,
            orderAddDesc: void 0,
            orderAsc: "Sort Asc",
            orderClear: void 0,
            orderDesc: "Sort Desc",
            orderRemove: void 0,
            reorder: void 0,
            reorderLeft: void 0,
            reorderRight: void 0,
            searchClear: void 0,
            searchDropdown: void 0,
            searchList: void 0,
            spacer: void 0,
            list: void 0,
            search: void 0
          }
        },
        responsive: true,
        dom: "Bfrtip",
        buttons: [
          "excel",
          "pdf"
        ]
      },
      className: "min-w-full bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg"
    }
  ) });
};
console.log("EventTable: ");
console.log(EventTable);
const UpcomingEventsPage = () => {
  const { events, loading } = useData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { loading, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "Photography Schedule" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-light text-gray-300", children: "Upcoming Event List" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EventTable, { events }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/previous", className: "text-blue-600 hover:underline", children: "View Previous Events" }) })
  ] });
};
const PreviousEventsPage = () => {
  const { pastEvents, loading } = useData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { loading, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "Photography Schedule" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-blue-600 hover:underline text-sm mb-4 block", children: "<< Back Home" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-light text-gray-400", children: "Previous Event List" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EventTable, { events: pastEvents })
  ] });
};
DataTable.Buttons.jszip(jszip);
DataTable.Buttons.pdfMake(pdfmake);
Exporter.use(DataTable);
const EntryTable = ({ entries }) => {
  const navigate = useNavigate();
  const handleRowClick = (entryId) => {
    navigate(`/entry-detail/${entryId}`);
  };
  const columns = [
    {
      title: "Actions",
      data: "entry_id",
      render: (data, type, row) => {
        return `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded view-entries-btn" data-event-id="${row.event_id}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16"><path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z" fill="white"/></svg></button>`;
      },
      createdCell: (cell, cellData, rowData) => {
        const button = cell.querySelector(".view-entries-btn");
        if (button) {
          button.addEventListener("click", () => {
            handleRowClick(rowData.entry_id);
          });
        }
      }
    },
    { title: "Date", data: "date" },
    { title: "Name", data: "name" },
    { title: "Timeframe", data: "timeframe" },
    { title: "Reason", data: "reason" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Exporter,
    {
      data: entries,
      columns,
      options: {
        language: {
          search: "Search:",
          searchPlaceholder: "Name, Timeframe, Reason, etc.",
          columnControl: {
            colVis: void 0,
            colVisDropdown: void 0,
            dropdown: void 0,
            orderAddAsc: void 0,
            orderAddDesc: void 0,
            orderAsc: "Sort Asc",
            orderClear: void 0,
            orderDesc: "Sort Desc",
            orderRemove: void 0,
            reorder: void 0,
            reorderLeft: void 0,
            reorderRight: void 0,
            searchClear: void 0,
            searchDropdown: void 0,
            searchList: void 0,
            spacer: void 0,
            list: void 0,
            search: void 0
          }
        },
        responsive: true,
        dom: "Bfrtip",
        buttons: [
          "excel",
          "pdf"
        ]
      },
      className: "min-w-full bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg",
      onRowClick: (rowData) => handleRowClick(rowData.entry_id)
    }
  ) });
};
const EventEntries = () => {
  const { eventId } = useParams();
  const event_id = eventId;
  const { getEventById, getEntriesByEventId, entries: allEntries, loading } = useData();
  const event = event_id ? getEventById(event_id) : void 0;
  const entries = event_id ? getEntriesByEventId(event_id) : allEntries;
  reactExports.useEffect(() => {
    console.log("event_id:", event_id);
    console.log("entries:", entries);
  }, [event_id, entries]);
  const eventDate = event ? new Date(event.date).toLocaleDateString("en-US", { timeZone: "UTC", month: "2-digit", day: "2-digit", year: "numeric" }) : "";
  const subtitle = event ? `${event.name} (${eventDate})` : "All Entries";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { loading, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "Photography Schedule", subtitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/`, className: "text-blue-600 hover:underline text-sm mb-4 block", children: "<< Back Home" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EntryTable, { entries })
  ] });
};
const QR_CODE_BASE_URL = "https://https://shop.imagequix.com/";
const EntryDetail = () => {
  const { entry_id } = useParams();
  const navigate = useNavigate();
  const { getEntryById, updateEntryDoneStatus, loading, getEventById } = useData();
  const entry = getEntryById(entry_id || "");
  const event = entry ? getEventById(entry.parent_event_id) : void 0;
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { loading: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}) });
  }
  if (!entry || !event) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { loading: false, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Entry not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-blue-600 hover:underline", children: "Go Home" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(-1), className: "text-blue-600 hover:underline", children: "Go Back" })
    ] }) });
  }
  const eventDate = new Date(event.date).toLocaleDateString("en-US", { timeZone: "UTC", month: "2-digit", day: "2-digit", year: "numeric" });
  const subtitle = `${event.name} (${eventDate})`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { loading, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "Photography Schedule", subtitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/event-entries/${event.event_id}`, className: "text-blue-600 hover:underline text-sm mb-4 block", children: "<< Back to List" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-lg", children: entry.originalDate }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-light text-gray-900 my-2", children: entry.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl text-gray-700 font-light", children: entry.reason }),
      entry.comments && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wrap-collabsible", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "collapsible", className: "toggle", type: "checkbox" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "collapsible", className: "lbl-toggle text-blue-500 hover:underline mt-2 inline-block", children: "More Info" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "collapsible-content", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "content-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-700 mt-4 text-left p-4 bg-gray-100 rounded-md", children: entry.comments }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex justify-center", children: entry.entry_id && /* @__PURE__ */ jsxRuntimeExports.jsx(distExports.QRCode, { value: `${QR_CODE_BASE_URL}${entry.unique_captura_id}`, size: 256 }) })
    ] })
  ] });
};
const App = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DataProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HashRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(UpcomingEventsPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/previous", element: /* @__PURE__ */ jsxRuntimeExports.jsx(PreviousEventsPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/event-entries/:eventId", element: /* @__PURE__ */ jsxRuntimeExports.jsx(EventEntries, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/entry-detail/:entry_id", element: /* @__PURE__ */ jsxRuntimeExports.jsx(EntryDetail, {}) })
  ] }) }) });
};
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
