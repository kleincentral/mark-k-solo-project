import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_CHARACTER" actions
function* fetchCharacter() {
  try {
    const response = yield axios.get("/api/characters");

    yield put({ type: "SET_CHARACTER", payload: response.data });
  } catch (error) {
    console.log("Character GET request failed", error);
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
    console.log("Character POST request failed", error);
  }
}

function* editCharacter(action) {
  try {
    const response = yield axios({
      method: "PUT",
      url: `/api/characters`,
      data: action.payload,
    });
    yield put({ type: "FETCH_CHARACTER" });
  } catch (error) {
    console.log("Character EDIT request failed", error);
  }
}

function* deleteCharacter(action) {
  try {
    const response = yield axios({
      method: "DELETE",
      url: `/api/characters/${action.payload}`,
    });
    yield put({ type: "FETCH_CHARACTER" });
  } catch (error) {
    console.log("Character DELETE request failed", error);
  }
}

function* characterSaga() {
  yield takeLatest("FETCH_CHARACTER", fetchCharacter);
  yield takeLatest("CREATE_CHARACTER", createCharacter);
  yield takeLatest("UPDATE_CHARACTER", editCharacter);
  yield takeLatest("DELETE_CHARACTER", deleteCharacter);
}

export default characterSaga;
