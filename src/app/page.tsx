import Image from "next/image";
import Dashboard from "../components/dashboard";
import { NotesFolderProvider } from "../context/notes-folder-context";
export default function Home() {
  return (
    <NotesFolderProvider>
      <Dashboard />
    </NotesFolderProvider>
  );
}
