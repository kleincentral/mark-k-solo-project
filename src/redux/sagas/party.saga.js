import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_PARTY" actions
function* fetchParty() {
  try {
    const response = yield axios.get("/api/party");

    yield put({ type: "SET_PARTY", payload: response.data });
  } catch (error) {
    console.log("Party GET request failed", error);
  }
}

function* createParty(action) {
  try {
    const response = yield axios({
      method: "POST",
      url: `/api/party`,
      data: action.payload,
    });

    yield put({ type: "FETCH_PARTY" });
  } catch (error) {
    console.log("Party POST request failed", error);
  }
}

function* editParty(action) {
  try {
    const response = yield axios({
      method: "PUT",
      url: `/api/party`,
      data: action.payload,
    });
    yield put({ type: "FETCH_PARTY" });
  } catch (err) {
    console.log("Party PUT request failed", err);
  }
}

function* deleteParty(action) {
  try {
    const response = yield axios.delete(`/api/party/${action.payload}`);
    yield put({ type: "FETCH_PARTY" });
  } catch (err) {
    console.log("Party DELETE request failed", err);
  }
}

function* partySaga() {
  yield takeLatest("FETCH_PARTY", fetchParty);
  yield takeLatest("CREATE_PARTY", createParty);
  yield takeLatest("EDIT_PARTY", editParty);
  yield takeLatest("DELETE_PARTY", deleteParty);
}

export default partySaga;
