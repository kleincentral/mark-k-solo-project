import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchWorld() {
  try {
    const response = yield axios.get("/api/world");

    yield put({ type: "SET_WORLD", payload: response.data });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* worldSaga() {
  yield takeLatest("FETCH_WORLD", fetchWorld);
}

export default worldSaga;
