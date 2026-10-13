import { ConnectScreen } from "@/app/(flow)/connect/connect-screen"
import { listCatalogRepos } from "@/lib/server/catalog"

export default function ConnectPage() {
  return <ConnectScreen repos={listCatalogRepos()} />
}
