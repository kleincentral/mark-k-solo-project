import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchCharacter() {
  try {
    const response = yield axios.get("/api/characters");

    yield put({ type: "SET_CHARACTER", payload: response.data });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* characterSaga() {
  yield takeLatest("FETCH_CHARACTER", fetchCharacter);
}

export default characterSaga;
