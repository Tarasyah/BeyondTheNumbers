import { getMartyrs } from "@/lib/api";
import { MartyrsClientPage } from "./martyrs-client-page";

export default async function MartyrsPageWrapper() {
    const allMartyrs = await getMartyrs() || [];
    return <MartyrsClientPage allMartyrs={allMartyrs} />;
}
