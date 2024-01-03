import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_BUILD" actions
function* fetchBuild() {
  try {
    const response = yield axios.get("/api/class_build/build");

    yield put({ type: "SET_BUILD", payload: response.data });
  } catch (error) {
    console.log("Class get request failed", error);
  }
}

function* buildSaga() {
  yield takeLatest("FETCH_BUILD", fetchBuild);
}

export default buildSaga;
