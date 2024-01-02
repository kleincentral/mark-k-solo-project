import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchParty() {
  try {
    const response = yield axios.get("/api/party");

    yield put({ type: "SET_PARTY", payload: response.data });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* partySaga() {
  yield takeLatest("FETCH_PARTY", fetchParty);
}

export default partySaga;
