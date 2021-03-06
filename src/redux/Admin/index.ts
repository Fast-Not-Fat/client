import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

import { payloads } from "@colobobo/library";

export interface AdminState {
  status: boolean;
  roomId: string | null;
  deviceIndex: string;
  connectedDevices: { [adminDeviceIndex: string]: { playerId: string } };
}

export const slice = createSlice({
  name: "admin",
  initialState: {
    status: false,
    roomId: null,
    connectedDevices: {}
  } as AdminState,
  reducers: {
    activate: (state: AdminState) => {
      state.status = true;
    },
    disable: (state: AdminState) => {
      state.status = false;
    },
    setRoomId: (state: AdminState, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.roomId = id;
    },
    setDeviceIndex: (
      state: AdminState,
      action: PayloadAction<{ index: string }>
    ) => {
      const { index } = action.payload;
      state.deviceIndex = index;
    },
    deviceConnected: (
      state: AdminState,
      action: PayloadAction<payloads.admin.DeviceConnected>
    ) => {
      const { deviceIndex, playerId } = action.payload.data;
      state.connectedDevices[deviceIndex] = { playerId };
    }
  }
});

// Selectors

const getRoot = (state: RootState) => state.admin;
const selectStatus = (state: RootState) => getRoot(state).status;
const selectRoomId = (state: RootState) => getRoot(state).roomId;
const selectDeviceIndex = (state: RootState) => getRoot(state).deviceIndex;
const selectConnectedDevices = (state: RootState) =>
  getRoot(state).connectedDevices;
export const selectors = {
  selectStatus,
  selectRoomId,
  selectDeviceIndex,
  selectConnectedDevices
};

// reducer / actions
export const { reducer, actions } = slice;
