import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

const TrainingPage = lazy(() => import("./pages/TrainingPage"));

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-un-accent focus:text-un-dark focus:font-medium focus:w-auto focus:h-auto focus:m-0 focus:overflow-visible focus:clip-auto"
      >
        Skip to main content
      </a>
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
    </>
  );
}
