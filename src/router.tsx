import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import LoginPage, { loginAction } from "./pages/LoginPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import Root from "./pages/Root";
import InstrumentPage, {
  deleteInstrumentAction,
  editInstrumentAction,
  editInstrumentLoader,
  newInstrumentAction,
  newInstrumentLoader,
} from "./pages/instruments/InstrumentPage";
import InstrumentsPage, {
  instrumentsLoader,
} from "./pages/instruments/InstrumentsPage";
import MeasurmentPage, {
  measurmentLoader,
} from "./pages/measurments/MeasurmentPage";
import MeasurmentsPage, {
  deleteMeasurementAction,
  measurmentsLoader,
  newMeasurment,
} from "./pages/measurments/MeasurmentsPage";
import {
  deleteProgramStepAction,
  newProgramStepAction,
} from "./pages/programSteps/ProgramSteps";
import ProgramPage, {
  deleteProgramAction,
  programLoader,
  updateProgramAction,
} from "./pages/programs/ProgramPage";
import ProgramsPage, {
  newProgramAction,
  programsLoader,
} from "./pages/programs/ProgramsPage";
import UnitPage, {
  deleteUnitAction,
  unitLoader,
  updateUnitAction,
} from "./pages/units/UnitPage";
import UnitsPage, {
  createUnitAction,
  unitsLoader,
} from "./pages/units/UnitsPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    action: loginAction,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            path: "/programs",
            element: <ProgramsPage />,
            loader: programsLoader,
            action: newProgramAction,
          },
          {
            path: "/programs/:programId",
            element: <ProgramPage />,
            loader: programLoader,
            action: updateProgramAction,
          },
          {
            path: "/programs/:programId/delete",
            action: deleteProgramAction,
          },
          {
            path: "/measurments",
            element: <MeasurmentsPage />,
            loader: measurmentsLoader,
          },
          {
            path: "/measurments/new",
            element: <MeasurmentsPage />,
            action: newMeasurment,
          },
          {
            path: "/measurments/:measurementId",
            element: <MeasurmentPage />,
            loader: measurmentLoader,
          },
          {
            path: "/measurments/:measurementId/delete",
            action: deleteMeasurementAction,
          },
          {
            path: "/instruments",
            element: <InstrumentsPage />,
            loader: instrumentsLoader,
          },
          {
            path: "/instruments/new",
            element: <InstrumentPage />,
            loader: newInstrumentLoader,
            action: newInstrumentAction,
          },
          {
            path: "/instruments/:instrumentId",
            element: <InstrumentPage />,
            loader: editInstrumentLoader,
            action: editInstrumentAction,
          },
          {
            path: "/instruments/:instrumentId/delete",
            action: deleteInstrumentAction,
          },
          {
            path: "/units",
            element: <UnitsPage />,
            loader: unitsLoader,
            action: createUnitAction,
          },
          {
            path: "/units/:unitId",
            element: <UnitPage />,
            loader: unitLoader,
            action: updateUnitAction,
          },
          {
            path: "/units/:unitId/delete",
            action: deleteUnitAction,
          },
          {
            path: "/steps",
            action: newProgramStepAction,
          },
          {
            path: "/steps/:programStepId/delete",
            action: deleteProgramStepAction,
          },
        ],
      },
    ],
  },
]);

export default router;
