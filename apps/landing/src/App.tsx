import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

const TrainingPage = lazy(() => import("./pages/TrainingPage"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/training"
        element={
          <Suspense fallback={
            <div className="min-h-screen bg-un-dark text-un-text flex items-center justify-center">
              <p className="text-un-muted">Loading Basic Training…</p>
            </div>
          }>
            <TrainingPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
