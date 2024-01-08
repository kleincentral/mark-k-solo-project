import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchWorld() {
  try {
    const response = yield axios.get("/api/world");

    yield put({ type: "SET_WORLD", payload: response.data });
  } catch (error) {
    console.log("World get request failed", error);
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
    console.log("World POST request failed", error);
  }
}

function* editWorld(action) {
  try {
    const response = yield axios({
      method: "PUT",
      url: `/api/world/${action.payload.currentWorldID}`,
      data: action.payload,
    });
    yield put({ type: "FETCH_WORLD" });
  } catch (err) {
    console.log("World PUT request failed", err);
  }
}

function* deleteWorld(action) {
  try {
    const response = yield axios({
      method: "DELETE",
      url: `api/world/${action.payload}`,
    });
    yield put({ type: "FETCH_WORLD" });
  } catch (err) {
    console.log("World DELETE request failed", err);
  }
}

function* worldSaga() {
  yield takeLatest("FETCH_WORLD", fetchWorld);
  yield takeLatest("CREATE_WORLD", createWorld);
  yield takeLatest("EDIT_WORLD", editWorld);
  yield takeLatest("DELETE_WORLD", deleteWorld);
}

export default worldSaga;
