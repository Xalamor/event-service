"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "@/lib/store/slices/authSlice";

const InitAuthState = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return null; // Этот компонент ничего не рендерит
};

export default InitAuthState;
