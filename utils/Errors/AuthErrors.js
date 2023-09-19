export function InvalidLogin() {
  throw new Error("invalid-credentials");
}

export function AccountNull() {
  throw new Error("account-missing");
}
