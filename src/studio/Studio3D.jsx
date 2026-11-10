import { forwardRef, lazy, Suspense } from "react";

const Mockup3D = lazy(() => import("../components/mockup3d/Mockup3D"));

const Studio3D = forwardRef(function Studio3D({ s, onQualidade }, ref) {
  return (
    <Suspense fallback={<div className="st-carregando">Carregando 3D…</div>}>
      <Mockup3D ref={ref} onQualidade={onQualidade} {...s} arte={s.capaSrc} />
    </Suspense>
  );
});
export default Studio3D;
