import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_CHARACTER" actions
function* fetchCharacter() {
  try {
    const response = yield axios.get("/api/characters");

    yield put({ type: "SET_CHARACTER", payload: response.data });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* createCharacter(action) {
  try {
    const response = yield axios({
      method: "POST",
      url: `/api/characters`,
      data: action.payload,
    });
    yield put({ type: "FETCH_CHARACTER" });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* characterSaga() {
  yield takeLatest("FETCH_CHARACTER", fetchCharacter);
  yield takeLatest("CREATE_CHARACTER", createCharacter);
}

export default characterSaga;
