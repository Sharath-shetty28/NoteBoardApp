import api from "../lib/axios";

function NotesFilter({ onFilter }) {
  const handleFilter = async (range) => {
    if (!range) return;
    // Fetch notes with the specified range
    const res = await api.get(`/notes?range=${range}`);
    const data = res.data;
    console.log("Filtered notes:", data);
    onFilter(data);
  };

  return (
    <div className="flex gap-2 mb-4">
      <button onClick={() => handleFilter("24h")}>Last 24h</button>
      <button onClick={() => handleFilter("7d")}>Last 7d</button>
      <button onClick={() => handleFilter("30d")}>Last 30d</button>
    </div>
  );
}
export default NotesFilter;
