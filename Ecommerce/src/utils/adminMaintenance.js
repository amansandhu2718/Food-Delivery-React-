import api from "./api";

export function postSeedDemo() {
  return api.post("/api/admin/seed-demo");
}

export function postResetSystem() {
  return api.post("/api/admin/reset-system");
}
