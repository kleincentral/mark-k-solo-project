import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_CLASS" actions
function* fetchClass() {
  try {
    const response = yield axios.get("/api/class_build/class");

    yield put({ type: "SET_CLASS", payload: response.data });
  } catch (error) {
    console.log("Class get request failed", error);
  }
}

function* classSaga() {
  yield takeLatest("FETCH_CLASS", fetchClass);
}

export default classSaga;
