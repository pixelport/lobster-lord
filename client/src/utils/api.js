export async function doKeyScan(pattern = '*', cursor = '0', connectionId = null) {
  const res = await fetch(`/scan/${pattern}/${cursor}?connection=${connectionId}`)
  return res.json()
}

export async function getConnections() {
  const res = await fetch('/connection/all')
  return res.json()
}
