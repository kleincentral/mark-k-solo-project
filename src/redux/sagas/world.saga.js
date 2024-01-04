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

function* createWorld(action) {
  try {
    const response = yield axios({
      method: "POST",
      url: `/api/world`,
      data: action.payload,
    });

    yield put({ type: "FETCH_WORLD" });
  } catch (error) {
    console.log("User POST request failed", error);
  }
}

function* worldSaga() {
  yield takeLatest("FETCH_WORLD", fetchWorld);
  yield takeLatest("CREATE_WORLD", createWorld);
}

export default worldSaga;
